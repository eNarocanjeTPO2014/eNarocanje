import base64
import datetime
import pdb
import pickle

from django.contrib import messages
from django.core.mail import EmailMessage
from django.http import HttpResponseRedirect, Http404
from django.shortcuts import render_to_response
from django.template.loader import get_template
from django.utils.translation import ugettext_lazy as _
from enarocanje.service.models import Service

from enarocanje.tasks.mytasks import *

# Create your views here.
from django.template import RequestContext, Context
from enarocanje.accountext.decorators import for_service_providers
from enarocanje.accountext.models import ServiceProviderImage
from enarocanje.customers.models import Customer
from enarocanje.mailservice.forms import EmailForm, NotificationConditionsForm
from enarocanje.mailservice.models import MailService
from enarocanje.reservations.models import Reservation
from enarocanje.settings import MEDIA_URL
from django.core.urlresolvers import reverse
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

SORT_CHOICES_NOTIFICATIONS = (
    (_('Order by date sent'), 'date'),
    (_('Order by title'), 'title')

    #TODO: dodatno
)


def construct_url_mynotifications(q, sor, page):
    parts = []
    if q:
        parts.append('q=%s' % q)
    if sor != 'date':
        parts.append('sort=%s' % sor)
    if page:
        parts.append('page=%s' % page)
    if parts:
        return '?' + '&'.join(parts)
    return reverse(mynotifications)


@for_service_providers
def mynotifications(request):
    #All send mails
    current_service_provider_id = request.user.service_provider.id
    all_sent_mails = MailService.objects.filter(service_provider=current_service_provider_id)

    sent_mails = all_sent_mails.order_by()

    q = request.GET.get('q', '')
    sor = request.GET.get('sort', 'date')
    page = request.GET.get('page')

    sort_choices = [
        (sort[0], construct_url_mynotifications(q, sort[1], page), sort[1] == sor)
        for sort in SORT_CHOICES_NOTIFICATIONS
    ]
    #pdb.set_trace()
    # Search by title
    if q:
        all_sent_mails = all_sent_mails.filter(title__contains=q)
    # Order by
    if sor == 'title':
        all_sent_mails = all_sent_mails.order_by('title')
    elif sor == 'date':
        # Sort by  date sent and then by title
        all_sent_mails = all_sent_mails.order_by('-date_time', 'title')

    paginator = Paginator(all_sent_mails, 15)

    try:
        all_sent_mails = paginator.page(page)
    except PageNotAnInteger:
        # If page is not an integer, deliver first page.
        all_sent_mails = paginator.page(1)
    except EmptyPage:
        # If page is out of range (e.g. 9999), deliver last page of results.
        all_sent_mails = paginator.page(paginator.num_pages)

    if all_sent_mails.has_previous():
        prev_page = construct_url_mynotifications(q, sor, all_sent_mails.previous_page_number())
    if all_sent_mails.has_next():
        next_page = construct_url_mynotifications(q, sor, all_sent_mails.next_page_number())
    return render_to_response('customers/customernotifications.html', locals(),
                              context_instance=RequestContext(request))


@for_service_providers
def sendmail(request):
    if request.method == 'POST':
        title = request.POST.get('subject', '')
        message = request.POST.get('message', '')

        imgs = ServiceProviderImage.objects.filter(service_provider=2)
        img = MEDIA_URL
        #pdb.set_trace()

        ctx = {
            'email': request.user.email,
            'title': title,
            'message': message
        }

        customer_ids = Reservation.objects.filter(service_provider=request.user.service_provider).exclude(
            customer__isnull=True).values_list('customer_id', flat=True).distinct()

        # Find customers who have not reserved anything yet and were added by service provider
        customers_nonr = Customer.objects.filter(service_provider=request.user.service_provider)
        customers = Customer.objects.filter(pk__in=customer_ids)

        all_recipients = customers_nonr | customers

        msg = get_template('emails/servicenotification.html').render(Context(ctx))
        service_provider_email = request.user.email

        recipents_ids = ""
        recipent_number = 0
        current_datetime = datetime.datetime.today()

        for recipent in all_recipients:
            recipient_reservations = Reservation.objects.filter(customer_id=recipent.id)
            if recipient_reservations.__len__() == 0:
                continue
            send_notification = recipient_reservations[recipient_reservations.__len__() - 1].service_notifications
            if send_notification:
                email = EmailMessage(title, msg, service_provider_email, to=[recipent.email])
                email.content_subtype = 'html'
                email.send()
                recipents_ids += " " + str(recipent.id)
                recipent_number += 1

        sent_mail = MailService(title=title, message=message, mail_type=1, date_time=current_datetime,
                                number_of_recipients=recipent_number, recipients=recipents_ids,
                                service_provider=request.user.service_provider)
        sent_mail.save()
        emailForm = EmailForm()

        messages.success(request, _('Your messages was sent successfully.'))
        return HttpResponseRedirect(reverse(mynotifications))

    else:
        emailForm = EmailForm()
        return render_to_response('customers/sendmail.html', locals(), context_instance=RequestContext(request))


@for_service_providers
def selectcustomers(request):
    if request.method != 'POST':


        conditionsForm = NotificationConditionsForm()

        conditionsForm.fields['regular_customers'].choices =(('0','Moje storitve obiscejo vsaj 1-krat'),('1','Obiskujejo moje storitve veckrat letno'),('2','Obiskujejo moje storitve vsaj 1-krat mesecno'))

        services = [('-1','Vse storitve')]
        services += [(service.id, service.name) for service in Service.objects.filter(service_provider=request.user.service_provider)]
        conditionsForm.fields['specific_service'].choices = services

        conditionsForm.fields['customers_liking_discounts'].choices = (('0','Obiskale storitev brez popusta'), ('1','Obiskale storitev z najvec 20% popustom'), ('2','Obiskale storitev z vsaj 20% in najvec 40% popusta'), ('3','Obiskale storitev z vsaj 40% popustom'))



        return render_to_response('customers/sendmailspecificcustomer.html', locals(), context_instance=RequestContext(request))



    step = request.POST.get('step', '1')

    if step == '1':
        regular_customers_choice = request.POST.get('regular_customers', '')
        specific_service_choice = request.POST.get('specific_service', '')
        customers_liking_discounts_choice = request.POST.get('customers_liking_discounts', '')


        mycustomers_in_reservations = Reservation.objects.filter(service_provider=request.user.service_provider).exclude(customer__isnull=True)

        regular_customers_choice_values = [1, 4, 8]
        customers_liking_discounts_choice_values = [0,20,40,70]
        regular_customers = []
        for i in range(0, mycustomers_in_reservations.__len__()):
            customer = mycustomers_in_reservations[i]
            counter = 0
            if customer.user == None:
                for j in range(0, mycustomers_in_reservations.__len__()):
                    if customer.user_email == mycustomers_in_reservations[j].user_email:
                        counter += 1
            if counter >= regular_customers_choice_values[int(regular_customers_choice)]:
                regular_customers.append(customer)
            else:
                for j in range(0, mycustomers_in_reservations.__len__()):
                    if customer.user == mycustomers_in_reservations[j].user:
                        counter += 1
                if counter >= regular_customers_choice_values[int(regular_customers_choice)]:
                    regular_customers.append(customer)

        customer_attended_service = []
        for i in range(0, regular_customers.__len__()):
            if specific_service_choice != '-1':
                if regular_customers[i].service_id == int(specific_service_choice):
                    customer_attended_service.append(regular_customers[i])
            else:
                customer_attended_service = regular_customers

        recipients = []
        for i in range(0, customer_attended_service.__len__()):
            insert = True
            for j in range(0, recipients.__len__()):
                if  recipients[j].user_email == customer_attended_service[i].user_email:
                    insert = False
            if insert:
                recipients.append(customer_attended_service[i])

        request.session['recipients']= recipients

        emailForm = EmailForm()
        return render_to_response('customers/sendmail.html', locals(), context_instance=RequestContext(request))
    if step == '2':
        recipients = request.session['recipients']

        title = request.POST.get('subject', '')
        message = request.POST.get('message', '')

        ctx = {
            'email': request.user.email,
            'title': title,
            'message': message
        }
        msg = get_template('emails/servicenotification.html').render(Context(ctx))
        service_provider_email = request.user.email

        recipents_ids = ""
        recipent_number = 0
        current_datetime = datetime.datetime.today()

        for recipient in recipients:
            email = EmailMessage(title, msg, service_provider_email, to=[recipient.user_email])
            email.content_subtype = 'html'
            email.send()
            recipent_number += 1

        sent_mail = MailService(title=title, message=message, mail_type=1, date_time=current_datetime,
                                number_of_recipients=recipent_number,
                                service_provider=request.user.service_provider)
        sent_mail.save()


        messages.success(request, _('Your messages was sent successfully.'))
        return HttpResponseRedirect(reverse(mynotifications))


