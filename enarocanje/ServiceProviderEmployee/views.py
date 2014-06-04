# Create your views here.
import datetime
import json
import urllib

from django.conf import settings
from django.core.mail import send_mail
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.core.exceptions import FieldError
from django.core.urlresolvers import reverse
from django.db.models import Q
from django.http import Http404
from django.http import HttpResponseRedirect
from django.shortcuts import render_to_response, get_object_or_404
from django.template import RequestContext
from django.template.loader import render_to_string
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _

from enarocanje.accountext.decorators import for_service_providers
from enarocanje.accountext.forms import ServiceProviderImageForm
from enarocanje.accountext.models import ServiceProvider, ServiceProviderImage, Category as SPCategory
from enarocanje.reservations.models import Reservation
from forms import ServiceProviderEmployeeForm
from models import ServiceProviderEmployee

# Choices for sorting customers
SORT_CHOICES_EMPLOYEES = (
    (_('Order by last name'), 'last_name'),
    #TODO: dodatno
)

# Method for constructing url addresses
def construct_url_employees( q, sor, page):
    parts = []
    if q:
        parts.append('q=%s' % q)
    if sor != 'last_name':
        parts.append('sort=%s' % sor)
    if page:
        parts.append('page=%s' % page)
    if parts:
        return '?' + '&'.join(parts)
    return reverse(myemployees)


@for_service_providers
def myemployees(request):
    employees = request.user.service_provider.employees.all()
    # locals() returns a dictionary of variables in the local scope (request and services in this case)
    return render_to_response('serviceprovideremployee/myemployees.html', locals(), context_instance=RequestContext(request))

# Add a new employees
@for_service_providers
def add(request):
    if request.method == 'POST':
        # if method was post (form submission), fill form from post data
        form = ServiceProviderEmployeeForm(request.POST, request.FILES)
        form_valid = form.is_valid()
        if form_valid:
            # if form is valid, save it and redirect back to myemployees
            # commit=False tells form to not save the object to the database just yet and return it instead
            employee = form.save(commit=False)
            # set service_provider to the current user before we save the object to the database
            employee.service_provider = request.user.service_provider
            employee.save()
            return HttpResponseRedirect(reverse(myemployees))
    else:
        # on get request create empty form
        form = ServiceProviderEmployeeForm()
    # render form - new (get request) or invalid with error messages (post request)
    return render_to_response('serviceprovideremployee/add.html', locals(), context_instance=RequestContext(request))

# Edit existing employee
@for_service_providers
def edit(request, id):
    employee = get_object_or_404(ServiceProviderEmployee, service_provider=request.user.service_provider, id=id)
    if request.method == 'POST':
        form = ServiceProviderEmployeeForm(request.POST, request.FILES, instance=employee)
        form_valid = form.is_valid()
        if form_valid:
            form.save()
            return HttpResponseRedirect(reverse(myemployees))
    else:
        form = ServiceProviderEmployeeForm(instance=employee)
    return render_to_response('serviceprovideremployee/edit.html', locals(), context_instance=RequestContext(request))

# Activate/deactivate Employee
@for_service_providers
def manage(request):
    if request.method == 'POST':
        employee = get_object_or_404(ServiceProviderEmployee, service_provider=request.user.service_provider, id=request.POST.get('employee'))
        if request.POST.get('action') == 'activate':
            employee.active_to = None
            employee.save()
        if request.POST.get('action') == 'deactivate':
            employee.active_to = datetime.date.today() - datetime.timedelta(1)
            employee.save()
        if request.POST.get('action') == 'delete':
            employee.delete()
    return HttpResponseRedirect(reverse(myemployees))