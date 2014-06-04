
import base64
import datetime
import pdb
import pickle
import string
import urllib

from django.conf import settings
from django.core.mail import send_mail
from django.core.mail import send_mass_mail
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from django.core.urlresolvers import reverse
from django.http import Http404
from django.http import HttpResponseRedirect
from django.shortcuts import render_to_response, get_object_or_404
from django.template import RequestContext
from django.template.loader import render_to_string
from django.utils.translation import ugettext_lazy as _
from setuptools.command.sdist import re_finder

from enarocanje.accountext.decorators import for_service_providers
from enarocanje.accountext.models import User
from enarocanje.common.timeutils import datetime_to_url_format
from enarocanje.coupon.models import Coupon
from enarocanje.customers.models import Customer
from enarocanje.customers.views import construct_url_customers
from enarocanje.reservations.gcal import sync
from enarocanje.reservations.models import Reservation
from enarocanje.service.models import Service
from enarocanje.ServiceProviderEmployee.models import ServiceProviderEmployee
from enarocanje.tasks.mytasks import *
from enarocanje.workinghours.models import WorkingHours, EmployeeWorkingHours
from forms import ReservationForm, NonRegisteredUserForm, ReservationsForm
from rcalendar import getMinMaxTime


# Choices for sorting reservations
SORT_CHOICES_RESERVATIONS = (
    (_('Order by service'), 'service'),
    (_('Order by date'), 'date'),
    (_('Order by customer'), 'customer'),
    (_('Order by employee'), 'employee'),
)

SEARCH_CHOICES_RESERVATIONS = (
    (_('Service'), 'service'),
    (_('Customer'), 'customer'),
    (_('Employee'), 'employee'),
)

# Method for constructing url addresses
def construct_url_reservations( q, src, sor, page):
    parts = []
    if q:
        parts.append('q=%s' % q)
    if src != 'service':
        parts.append('src=%s' % src)
    if sor != 'name':
        parts.append('sort=%s' % sor)
    if page:
        parts.append('page=%s' % page)
    if parts:
        return '?' + '&'.join(parts)
    return reverse(allreservations)


# Service reservations
def reservation2(request, id):
    return reservation(request, id, 0)

def reservation(request, id, employee_id):
    service = get_object_or_404(Service, id=id)
    #Klemen: dobi zaposlenega za to storitev, ce je bil dolocen


    if employee_id > 0:
        service_provider_employee_obj = get_object_or_404(ServiceProviderEmployee, id=employee_id)
    else:
        service_provider_employee_obj = None

    if not service.is_active():
        raise Http404
    if service_provider_employee_obj:
        workingHoursEmployee = EmployeeWorkingHours.objects.get(service=service, service_provider_employee=service_provider_employee_obj)
        minTime = workingHoursEmployee.time_from
        maxTime = workingHoursEmployee.time_to
    else:
        minTime, maxTime = getMinMaxTime(service.service_provider)


    if request.POST.get('action', None) == 'employeechanged':
        workingHoursEmployee = EmployeeWorkingHours.objects.get(service=service, service_provider_employee_id=request.POST.get('service_provider_employee', None))
        minTime = workingHoursEmployee.time_from
        maxTime = workingHoursEmployee.time_to
        form = ReservationForm(request, workingHours=None, service=service, serviceProviderEmployee=service_provider_employee_obj, initial={"service_provider_employee": request.POST.get('service_provider_employee', None),})
        service_provider_employee_obj = ServiceProviderEmployee.objects.get(pk=request.POST.get('service_provider_employee', None))
        data = {'service_provider_id': service.service_provider_id} # 'service_provider_employee_id': service_provider_employee_obj.id }
        return render_to_response('reservations/reservation.html', locals(), context_instance=RequestContext(request))


    if request.method != 'POST':
        # ce je zaposleni dolocen, ga daj kot initial
        if service_provider_employee_obj:
            form = ReservationForm(request, workingHours=None, service=service, serviceProviderEmployee=service_provider_employee_obj, initial={"service_provider_employee":service_provider_employee_obj})
        else:
            #ce se ni bil izbran
            form = ReservationForm(request, workingHours=None, service=service, serviceProviderEmployee=service_provider_employee_obj)

        data = {'service_provider_id': service.service_provider_id} # 'service_provider_employee_id': service_provider_employee_obj.id }
        return render_to_response('reservations/reservation.html', locals(), context_instance=RequestContext(request))

    # POST
    step = request.POST.get('step', '1')

    try:
        data = pickle.loads(base64.b64decode(request.POST.get('data')))  # Serializes an object from request
    except:
        raise Http404

    if service_provider_employee_obj:
        workingHours = WorkingHours.objects.filter(service_provider_id=service.service_provider_id)
    else:
        workingHours = EmployeeWorkingHours.objects.filter(service=service, service_provider_employee=service_provider_employee_obj)




    formNonRegisteredUser = NonRegisteredUserForm()

    if step == '1':
        # Service, date, time
        # form = ReservationForm(request.POST, workingHours='gergerre')
        #service_provider_employee_choice = request.POST.get['service_provider_employee']
        #print service_provider_employee_choice
        form = ReservationForm(request, request.POST, workingHours=workingHours, service=service, serviceProviderEmployee=service_provider_employee_obj)

        if form.is_valid():
            data['date'] = form.cleaned_data['date']
            data['time'] = form.cleaned_data['time']
            data['number'] = form.cleaned_data['number']
            service_provider_employee_obj = form.cleaned_data['service_provider_employee']
            # ce je bil izbran zaposleni, shrani njegov id in ga prenesi v naslednje step-e

            if service_provider_employee_obj:
                data['service_provider_employee'] = form.cleaned_data['service_provider_employee'].id

            if request.user.is_authenticated():
                data['user_id'] = request.user.id
                data['name'] = request.user.get_full_name()
                data['phone'] = request.user.phone
                data['email'] = request.user.email
                data['service_notifications'] = request.user.service_notifications
                return render_to_response('reservations/confirmation.html', locals(), context_instance=RequestContext(request))

            return render_to_response('reservations/userinfo.html', locals(), context_instance=RequestContext(request))

        return render_to_response('reservations/reservation.html', locals(), context_instance=RequestContext(request))

    if step == '2':
        # User info
        if data.get('date') is None or data.get('time') is None:
            raise Http404
        formNonRegisteredUser = NonRegisteredUserForm(request.POST)
        if formNonRegisteredUser.is_valid():
            data['name'] = formNonRegisteredUser.cleaned_data['name']
            data['phone'] = formNonRegisteredUser.cleaned_data['phone']
            data['email'] = formNonRegisteredUser.cleaned_data['email']
            data['service_notifications'] = formNonRegisteredUser.cleaned_data['service_notifications']
            return render_to_response('reservations/confirmation.html', locals(), context_instance=RequestContext(request))

        return render_to_response('reservations/userinfo.html', locals(), context_instance=RequestContext(request))

    if step == '3':
        # Confirmation

        #inicializiraj objekt zaposlenega glede na to, kateri je bil prej izbran
        if data.get('service_provider_employee'):
            service_provider_employee_obj = get_object_or_404(ServiceProviderEmployee, id=data.get('service_provider_employee'))
        else:
            service_provider_employee_obj = None
        if data.get('date') is None or data.get('time') is None:  # or data.get('user_id') is None:
            raise Http404
        if data.get('user_id') is not None:
            ruser = get_object_or_404(User, id=data.get('user_id'))
        else:
            ruser = None

        sync(service.service_provider)

        # Checking again if form for reservation is valid
        form = ReservationForm(request, {'date': data.get('date'), 'time': data.get('time')}, workingHours=workingHours, service=service, serviceProviderEmployee=service_provider_employee_obj)
        #form.fields['service_provider_employee']=service_provider_employee_obj

        if form.is_valid():
            # Add a customer
            user_mail = None
            if ruser is None:
            # If an unregistered customer performs reservation
                customer_name = data.get('name').split()
                customer = Customer(name=customer_name[0], last_name=customer_name[len(customer_name)-1], phone=data.get('phone'), email=data.get('email'), full_name=data.get('name'))
                user_mail = data.get('email')
            else:
                # If a registered customer performs reservation
                customer = Customer(name=ruser.first_name, last_name=ruser.last_name, phone=ruser.phone, email=ruser.email, full_name=ruser.first_name+' '+ruser.last_name)
                user_mail = ruser.email
            try:
                Customer.objects.get(email=data.get('email'))

            except:
                # Save a customer if they are not already in
                customer.save()
            # Save a reservation
            customer = Customer.objects.get(email=user_mail)
            customer.last_reservation=datetime.datetime.today()
            customer.save(update_fields=['last_reservation'])
            reserve = Reservation(user=ruser, service=service, date=data['date'], time=data['time'], customer=customer, service_notifications=data['service_notifications'])
            # Add backup fields
            reserve.user_fullname = data.get('name')
            reserve.user_phone = data.get('phone')
            reserve.user_email = data.get('email')
            reserve.service_provider = service.service_provider
            reserve.service_name = service.name
            reserve.service_duration = service.duration
            reserve.service_price = service.discounted_price()
            reserve.service_provider_employee = service_provider_employee_obj
            # Save
            reserve.save()

            #Creating scheduler reminder
            if data.get('service_notifications'):
                datetime_reminder = datetime.datetime.combine(reserve.date, reserve.time) - datetime.timedelta(hours=4)
                if service.service_provider.send_sms_reminder:
                    send_reminder_sms.apply_async((data.get('time'), service.service_provider.name, service.name), eta=datetime_reminder)
                if service.service_provider.send_email_reminder:
                    send_reminder_email.apply_async((data.get('time'), service.service_provider.name, service.name), eta=datetime_reminder)

            elif request.user.send_reminders:
                datetime_reminder = datetime.datetime.combine(reserve.date, reserve.time) - datetime.timedelta(hours=4)
                if service.service_provider.send_sms_reminder:
                    send_reminder_sms.apply_async((data.get('time'), service.service_provider.name, service.name), eta=datetime_reminder)
                if service.service_provider.send_email_reminder:
                    send_reminder_email.apply_async((data.get('time'), service.service_provider.name, service.name), eta=datetime_reminder)

            # saving coupon is_valid
            coupons = Coupon.objects.filter(service=service.id)
            for coup in coupons:
                if(data['number'] == coup.number):
                    coup.is_used = True
                    coup.save()
                    # Validation checking in form

            email_to1 = data.get('email')
            email_to2 = service.service_provider.user.email
            if(service.service_provider.reservation_confirmation_needed == False):
                subject = _('Confirmation of service reservation')
                renderedToCustomer = render_to_string('emails/reservation_customer.html', {'reservation': reserve})
                renderedToProvider = render_to_string('emails/reservation_provider.html', {'reservation': reserve})
                message1 = (subject, renderedToCustomer, None, [email_to1])
                message2 = (subject, renderedToProvider, None, [email_to2])
                send_mass_mail((message1, message2), fail_silently=True)
            else:
                subject = _('Confirmation of service reservation')
                renderedToProvider = render_to_string('emails/reservation_provider.html', {'reservation': reserve})
                send_mail(subject, renderedToProvider, None, [email_to2], fail_silently=False)

            start = datetime.datetime.combine(reserve.date, reserve.time)
            gcal_params = urllib.urlencode({
                'action': 'TEMPLATE',
                'text': reserve.service_name.encode('utf8'),
                'dates': '%s/%s' % (datetime_to_url_format(start), datetime_to_url_format(start + datetime.timedelta(minutes=reserve.service_duration))),
                'details': reserve.service.description.encode('utf8'),
                'location': reserve.service_provider.full_address().encode('utf8'),
                'trp': 'true',
                'sprop': 'E-Narocanje',
                'sprop': 'name:%s' % settings.BASE_URL,
            })
            if service_provider_employee_obj <> None:
                url_service = settings.BASE_URL + reverse('service', args=(service.id,service_provider_employee_obj.id,))
            else:
                url_service = settings.BASE_URL + reverse('service2', args=(service.id,))

            sync(service.service_provider)

            return render_to_response('reservations/done.html', locals(), context_instance=RequestContext(request))

        # Someone else has made a reservation in the meantime
        return render_to_response('reservations/alreadyreserved.html', locals(), context_instance=RequestContext(request))
    raise Http404

#Prikaz koledarja
@for_service_providers
def myreservations(request):
    res_confirm = request.user.service_provider.reservation_confirmation_needed #to pustimo
    return render_to_response('reservations/myreservations.html', locals(), context_instance=RequestContext(request))


#Prikaz tabele vseh rezervacij
@for_service_providers
def allreservations(request):
    res_confirm = request.user.service_provider.reservation_confirmation_needed #to pustimo
    reservations = Reservation.objects.filter(service_provider=request.user.service_provider, is_deny=0).exclude(customer__isnull=True)
    q = request.GET.get('q', '')
    src = request.GET.get('src','service')
    sor = request.GET.get('sort', 'date')
    page = request.GET.get('page')

    selEmployee = request.session.get('se')
    sort_choices = [
        (sort[0], construct_url_reservations(q, src, sort[1], page), sort[1] == sor)
        for sort in SORT_CHOICES_RESERVATIONS
    ]
    search_choices = [
        (search[0], construct_url_reservations(q,  search[1], sor, page), search[1] == src)
        for search in SEARCH_CHOICES_RESERVATIONS
    ]

    #Filtering by Employee
    if request.method != 'POST':
       if selEmployee:
           resForm = ReservationsForm(sp=request.user.service_provider, employee=selEmployee, initial={"employee": selEmployee})
           reservations = reservations = reservations.filter(service_provider_employee=selEmployee)
       else:
        resForm = ReservationsForm(sp=request.user.service_provider, employee=ServiceProviderEmployee.objects.filter(service_provider=request.user.service_provider))
    elif request.method == 'POST':
        resForm = ReservationsForm(request.POST,  sp=request.user.service_provider, employee=ServiceProviderEmployee.objects.filter(service_provider=request.user.service_provider) )
        if resForm.is_valid():
            if resForm.cleaned_data['employee'] == None:
                reservations = Reservation.objects.filter(service_provider=request.user.service_provider, is_deny=0).exclude(customer__isnull=True)
                request.session['se'] = None
            else:
                reservations = reservations.filter(service_provider_employee=resForm.cleaned_data['employee'])
                request.session['se'] = resForm.cleaned_data['employee']

    if q:
        if src == 'customer':
            reservations = reservations.filter(user_fullname__contains = q)
        elif src == 'employee':
            reservations = reservations.filter(service_provider_employee__last_name__contains = q)
        else:
            reservations = reservations.filter(service_name__contains=q)


    # Order by
    if sor == 'service': #date, service, customer, employee
        reservations = reservations.order_by('-service_name')
    elif sor == 'date':
        reservations = reservations.order_by('-date','-time','-service_name')
    elif sor == 'customer':
        #reservations = reservations.order_by('-user_fullname')
        reservations = reservations.order_by('customer__last_name','customer__name')
    elif sor == 'employee':
        reservations = reservations.order_by('-service_provider_employee__last_name', '-service_provider_employee__first_name')



    #Pagination
    paginator = Paginator(reservations, 15)
    try:
        reservations = paginator.page(page)
    except PageNotAnInteger:
        # If page is not an integer, deliver first page.
        reservations = paginator.page(1)
    except EmptyPage:
        # If page is out of range (e.g. 9999), deliver last page of results.
        reservations = paginator.page(paginator.num_pages)

    if reservations.has_previous():
        prev_page = construct_url_reservations(q, src, sor, reservations.previous_page_number())
    if reservations.has_next():
        next_page = construct_url_reservations(q, src, sor, reservations.next_page_number())

    return render_to_response('reservations/allreservations.html', locals(), context_instance=RequestContext(request))




#Prikaz tabele vseh rezervacij v tem tednu
@for_service_providers
def allreservations_this(request):

    date = datetime.date.today()
    start_week = date - datetime.timedelta(date.weekday())
    end_week = start_week + datetime.timedelta(6)
    range = [start_week, end_week]


    res_confirm = request.user.service_provider.reservation_confirmation_needed #to pustimo
    reservations = Reservation.objects.filter(service_provider=request.user.service_provider, is_deny=0, date__range=[start_week, end_week]).exclude(customer__isnull=True).order_by('date', 'time')
    q = request.GET.get('q', '')
    src = request.GET.get('src','service')
    sor = request.GET.get('sort', 'date')
    page = request.GET.get('page')

    selEmployee = request.session.get('se')
    sort_choices = [
        (sort[0], construct_url_reservations(q, src, sort[1], page), sort[1] == sor)
        for sort in SORT_CHOICES_RESERVATIONS
    ]
    search_choices = [
        (search[0], construct_url_reservations(q,  search[1], sor, page), search[1] == src)
        for search in SEARCH_CHOICES_RESERVATIONS
    ]

    #Filtering by Employee
    if request.method != 'POST':
       if selEmployee:
           resForm = ReservationsForm(sp=request.user.service_provider, employee=selEmployee, initial={"employee": selEmployee})
           reservations = reservations = reservations.filter(service_provider_employee=selEmployee, is_deny=0, date__range=[start_week, end_week]).exclude(customer__isnull=True).order_by('date', 'time')
       else:
        resForm = ReservationsForm(sp=request.user.service_provider, employee=ServiceProviderEmployee.objects.filter(service_provider=request.user.service_provider))
    elif request.method == 'POST':
        resForm = ReservationsForm(request.POST,  sp=request.user.service_provider, employee=ServiceProviderEmployee.objects.filter(service_provider=request.user.service_provider) )
        if resForm.is_valid():
            if resForm.cleaned_data['employee'] == None:
                reservations = Reservation.objects.filter(service_provider=request.user.service_provider, is_deny=0, date__range=[start_week, end_week]).exclude(customer__isnull=True).order_by('date', 'time')
                request.session['se'] = None
            else:
                reservations = reservations.filter(service_provider_employee=resForm.cleaned_data['employee'])
                request.session['se'] = resForm.cleaned_data['employee']

    if q:
        if src == 'customer':
            reservations = reservations.filter(user_fullname__contains = q)
        elif src == 'employee':
            reservations = reservations.filter(service_provider_employee__last_name__contains = q)
        else:
            reservations = reservations.filter(service_name__contains=q)


    # Order by
    if sor == 'service': #date, service, customer, employee
        reservations = reservations.order_by('-service_name')
    elif sor == 'date':
        reservations = reservations.order_by('date','time','-service_name')
    elif sor == 'customer':
        #reservations = reservations.order_by('-user_fullname')
        reservations = reservations.order_by('customer__last_name','customer__name')
    elif sor == 'employee':
        reservations = reservations.order_by('-service_provider_employee__last_name', '-service_provider_employee__first_name')



    #Pagination
    paginator = Paginator(reservations, 15)
    try:
        reservations = paginator.page(page)
    except PageNotAnInteger:
        # If page is not an integer, deliver first page.
        reservations = paginator.page(1)
    except EmptyPage:
        # If page is out of range (e.g. 9999), deliver last page of results.
        reservations = paginator.page(paginator.num_pages)

    if reservations.has_previous():
        prev_page = construct_url_reservations(q, src, sor, reservations.previous_page_number())
    if reservations.has_next():
        next_page = construct_url_reservations(q, src, sor, reservations.next_page_number())

    return render_to_response('reservations/allreservations_this.html', locals(), context_instance=RequestContext(request))



#Prikaz tabele vseh rezervacij v naslednjem tednu
@for_service_providers
def allreservations_next(request):
    date = datetime.date.today()
    start_week_this = date - datetime.timedelta(date.weekday())
    start_week_next = start_week_this + datetime.timedelta(7)
    end_week_next = start_week_next + datetime.timedelta(6)
    print date
    print start_week_next
    print end_week_next
    range = [start_week_next, end_week_next]
    print range


    res_confirm = request.user.service_provider.reservation_confirmation_needed #to pustimo
    reservations = Reservation.objects.filter(service_provider=request.user.service_provider, is_deny=0, date__range=[start_week_next, end_week_next]).exclude(customer__isnull=True).order_by('date', 'time')
    q = request.GET.get('q', '')
    src = request.GET.get('src','service')
    sor = request.GET.get('sort', 'date')
    page = request.GET.get('page')

    selEmployee = request.session.get('se')
    sort_choices = [
        (sort[0], construct_url_reservations(q, src, sort[1], page), sort[1] == sor)
        for sort in SORT_CHOICES_RESERVATIONS
    ]
    search_choices = [
        (search[0], construct_url_reservations(q,  search[1], sor, page), search[1] == src)
        for search in SEARCH_CHOICES_RESERVATIONS
    ]

    #Filtering by Employee
    if request.method != 'POST':
       if selEmployee:
           resForm = ReservationsForm(sp=request.user.service_provider, employee=selEmployee, initial={"employee": selEmployee})
           reservations = reservations = reservations.filter(service_provider_employee=selEmployee, is_deny=0, date__range=[start_week_next, end_week_next]).exclude(customer__isnull=True).order_by('date', 'time')
       else:
        resForm = ReservationsForm(sp=request.user.service_provider, employee=ServiceProviderEmployee.objects.filter(service_provider=request.user.service_provider))
    elif request.method == 'POST':
        resForm = ReservationsForm(request.POST,  sp=request.user.service_provider, employee=ServiceProviderEmployee.objects.filter(service_provider=request.user.service_provider) )
        if resForm.is_valid():
            if resForm.cleaned_data['employee'] == None:
                reservations = Reservation.objects.filter(service_provider=request.user.service_provider, is_deny=0, date__range=[start_week_next, end_week_next]).exclude(customer__isnull=True).order_by('date', 'time')
                request.session['se'] = None
            else:
                reservations = reservations.filter(service_provider_employee=resForm.cleaned_data['employee'])
                request.session['se'] = resForm.cleaned_data['employee']

    if q:
        if src == 'customer':
            reservations = reservations.filter(user_fullname__contains = q)
        elif src == 'employee':
            reservations = reservations.filter(service_provider_employee__last_name__contains = q)
        else:
            reservations = reservations.filter(service_name__contains=q)


    # Order by
    if sor == 'service': #date, service, customer, employee
        reservations = reservations.order_by('-service_name')
    elif sor == 'date':
        reservations = reservations.order_by('date','time','-service_name')
    elif sor == 'customer':
        #reservations = reservations.order_by('-user_fullname')
        reservations = reservations.order_by('customer__last_name','customer__name')
    elif sor == 'employee':
        reservations = reservations.order_by('-service_provider_employee__last_name', '-service_provider_employee__first_name')



    #Pagination
    paginator = Paginator(reservations, 15)
    try:
        reservations = paginator.page(page)
    except PageNotAnInteger:
        # If page is not an integer, deliver first page.
        reservations = paginator.page(1)
    except EmptyPage:
        # If page is out of range (e.g. 9999), deliver last page of results.
        reservations = paginator.page(paginator.num_pages)

    if reservations.has_previous():
        prev_page = construct_url_reservations(q, src, sor, reservations.previous_page_number())
    if reservations.has_next():
        next_page = construct_url_reservations(q, src, sor, reservations.next_page_number())

    return render_to_response('reservations/allreservations_next.html', locals(), context_instance=RequestContext(request))


