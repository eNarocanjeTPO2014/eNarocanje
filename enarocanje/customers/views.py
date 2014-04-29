# Create your views here.
from datetime import datetime
from django.core.exceptions import FieldError
from django.core.urlresolvers import reverse
from django.http import Http404
from django.http.response import HttpResponse, HttpResponseRedirect
from django.shortcuts import render_to_response, get_object_or_404
from django.template.context import RequestContext
from enarocanje.accountext.decorators import for_service_providers
from enarocanje.accountext.models import ServiceProvider
from enarocanje.customers.models import Customer
from enarocanje.reservations.models import Reservation
from django.utils.translation import ugettext_lazy as _
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from forms import CustomerForm

# Choices for sorting customers
SORT_CHOICES_CUSTOMERS = (
    (_('Order by name'), 'name'),
    (_('Order by last reservation date'), 'date'),
    #TODO: dodatno
)

# Method for constructing url addresses
def construct_url_customers( q, sor, page):
    parts = []
    if q:
        parts.append('q=%s' % q)
    if sor != 'name':
        parts.append('sort=%s' % sor)
    if page:
        parts.append('page=%s' % page)
    if parts:
        return '?' + '&'.join(parts)
    return reverse(mycustomers)


@for_service_providers
def mycustomers(request):
    customer_ids = Reservation.objects.filter(service_provider=request.user.service_provider).exclude(customer__isnull=True).values_list('customer_id', flat=True).distinct();

    # Find customers who have not reserved anything yet and were added by service provider
    customers_nonr = Customer.objects.filter(service_provider=request.user.service_provider)
    customers = Customer.objects.filter(pk__in=customer_ids)
    # Merge two QuerySets together
    customers = customers | customers_nonr
    q = request.GET.get('q', '')
    sor = request.GET.get('sort', 'name')
    page = request.GET.get('page')


    sort_choices = [
        (sort[0], construct_url_customers(q, sort[1], page), sort[1] == sor)
        for sort in SORT_CHOICES_CUSTOMERS
    ]

    # Search by name
    if q:
        customers = customers.filter(full_name__contains=q)

    # find last reservation of every customer
    last_reservations = Reservation.objects.filter(service_provider=request.user.service_provider, customer__in = customers)
    for customer in customers:
        last_reservations_customer = last_reservations.filter(customer=customer)
        last_reservation = last_reservations_customer.order_by('-created')[:1].values_list('created',flat=True)
        if len(last_reservation) == 0:
            customer.last_reservation = None
        else:
            customer.last_reservation = last_reservation[0]

    # Order by
    if sor == 'name':
        customers = customers.order_by('last_name')
    elif sor == 'date':
        # Sort by last reservation date and then by last name
        customers = customers.order_by('-last_reservation','last_name')

    paginator = Paginator(customers, 15)
    try:
        customers = paginator.page(page)
    except PageNotAnInteger:
        # If page is not an integer, deliver first page.
        customers = paginator.page(1)
    except EmptyPage:
        # If page is out of range (e.g. 9999), deliver last page of results.
        customers = paginator.page(paginator.num_pages)

    if customers.has_previous():
        prev_page = construct_url_customers(q, sor, customers.previous_page_number())
    if customers.has_next():
        next_page = construct_url_customers(q, sor, customers.next_page_number())
    return render_to_response('customers/mycustomers.html', locals(), context_instance=RequestContext(request))


# View for adding a customer into view
@for_service_providers
def add(request):
    if request.method == 'POST':
        # if method was post (form submission), fill form with post data
        form = CustomerForm(request.POST)
        form_valid = form.is_valid()
        if form_valid:
            # if form is valid, save it and redirect back to mycustomers
            # commit=False tells form to not save the object to the database just yet and return it instead
            customer = form.save(commit=False)
            # set service_provider to the current customer before we save the object to the database
            customer.service_provider = request.user.service_provider
            customer.full_name = request.POST.get('name') + ' ' + request.POST.get('last_name')
            customer.last_reservation = None
            customer.save()
            return HttpResponseRedirect(reverse(mycustomers))
    else:
        # on get request create empty form
        form = CustomerForm()
    # render form - new (get request) or invalid with error messages (post request)
    return render_to_response('customers/add.html', locals(), context_instance=RequestContext(request))

# View for editing existing customer
@for_service_providers
def edit(request, id):
    customer = get_object_or_404(Customer, id=id)
    if request.method == 'POST':
        form = CustomerForm(request.POST, instance=customer)
        form_valid = form.is_valid()
        if form_valid:
            customer = form.save()
            customer.full_name = request.POST.get('name') + ' ' + request.POST.get('last_name')
            customer.save()

            return HttpResponseRedirect(reverse(mycustomers))

    else:
        form = CustomerForm(instance=customer)
    return render_to_response('customers/edit.html', locals(), context_instance=RequestContext(request))

#View customer's past reservations at selected service provider
@for_service_providers
def customer_reservations(request, id):
    customer = get_object_or_404(Customer, id=id)
    # get all comments
    reservations = customer.reservation_set.filter(is_deny=False).order_by('-created')
    number_of_reservations = reservations.count()

    return render_to_response('customers/reservations.html', locals(), context_instance=RequestContext(request))
