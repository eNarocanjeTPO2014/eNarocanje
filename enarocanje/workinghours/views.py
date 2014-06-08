import datetime
import pdb

from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect
from django.shortcuts import render_to_response, get_object_or_404
from django.template import RequestContext

from enarocanje.accountext.decorators import for_service_providers
from enarocanje.service.models import Service
from forms import WorkingHoursForm, WorkingHoursFormSet, AbsenceForm, EmployeeWorkingHoursForm
from models import WorkingHours, Absence, ServiceProviderEmployee, EmployeeWorkingHours
from django.utils.translation import ugettext_lazy as _
# Working hours

@for_service_providers
def myworkinghours(request):
    workinghours = request.user.service_provider.working_hours.all()
    return render_to_response('workinghours/myworkinghours.html', locals(), context_instance=RequestContext(request))

@for_service_providers
def add(request):
    if request.method == 'POST':
        form = WorkingHoursForm(request.POST, provider=request.user.service_provider)
        form_valid = form.is_valid()
        formset = WorkingHoursFormSet(request.POST)
        # formset forms need to know working hours for validation
        for fs_form in formset:
            fs_form.wh_time_from = form.cleaned_data.get('time_from')
            fs_form.wh_time_to = form.cleaned_data.get('time_to')
        formset_valid = formset.is_valid()
        # even if form fails validaton, formset should be still validated
        formset_valid = formset.is_valid()
        if form_valid and formset_valid:
            service = form.save(commit=False)
            service.service_provider = request.user.service_provider
            service.save()
            formset.instance = service
            formset.save()
            return HttpResponseRedirect(reverse(myworkinghours))
    else:
        initial = {}
        if not request.user.service_provider.working_hours.exists():
            initial['week_days'] = '1,2,3,4,5'
        form = WorkingHoursForm(initial=initial, provider=request.user.service_provider)
        formset = WorkingHoursFormSet()
    return render_to_response('workinghours/add.html', locals(), context_instance=RequestContext(request))

@for_service_providers
def edit(request, id):
    workinghours = get_object_or_404(WorkingHours, service_provider=request.user.service_provider, id=id)
    if request.method == 'POST':
        form = WorkingHoursForm(request.POST, instance=workinghours, provider=request.user.service_provider)
        form_valid = form.is_valid()
        formset = WorkingHoursFormSet(request.POST, instance=workinghours)
        # formset forms need to know working hours for validation
        for fs_form in formset:
            fs_form.wh_time_from = form.cleaned_data.get('time_from')
            fs_form.wh_time_to = form.cleaned_data.get('time_to')
        formset_valid = formset.is_valid()
        # even if form fails validaton, formset should be still validated
        if form_valid and formset_valid:
            form.save()
            formset.save()
            return HttpResponseRedirect(reverse(myworkinghours))
    else:
        form = WorkingHoursForm(instance=workinghours, provider=request.user.service_provider)
        formset = WorkingHoursFormSet(instance=workinghours)
    return render_to_response('workinghours/edit.html', locals(), context_instance=RequestContext(request))

@for_service_providers
def manage(request):
    if request.method == 'POST':
        workinghours = get_object_or_404(WorkingHours, service_provider=request.user.service_provider, id=request.POST.get('workinghours'))
        if request.POST.get('action') == 'delete':
            workinghours.delete()
    return HttpResponseRedirect(reverse(myworkinghours))


# 29.5.2014 RokA; Working hours for employees
@for_service_providers
def employee_workinghours(request, employee_id):
    employee = get_object_or_404(ServiceProviderEmployee, id=employee_id)
    #workinghours = get_object_or_404(WorkingHours, service_provider=request.user.service_provider, service_provider_employee=employee)

    workinghours = EmployeeWorkingHours.objects.filter(service_provider_employee=employee)
    return render_to_response('workinghours/employee_workinghours.html', locals(), context_instance=RequestContext(request))

@for_service_providers
def employee_add_workinghours(request, employee_id):
    employee= get_object_or_404(ServiceProviderEmployee, id=employee_id)
    if request.method == 'POST':

        form = EmployeeWorkingHoursForm(request.POST, employee=employee) #employee=employee
        form_valid = form.is_valid()

        if form_valid:
            service = form.save(commit=False)
            service.service_provider = request.user.service_provider
            service.service = form.cleaned_data['service']
            # Save
            service.service_provider_employee = employee
            service.save()


            return HttpResponseRedirect(reverse(employee_workinghours, kwargs={'employee_id':employee.id}))
    else:
        initial = {}
        wh = EmployeeWorkingHours.objects.filter(service_provider_employee=employee)
        if wh.__len__()==0:
            initial['week_days'] = '1,2,3,4,5'
        form = EmployeeWorkingHoursForm(initial=initial, employee=employee) #employee=employee

    return render_to_response('workinghours/employee_add_workinghours.html', locals(), context_instance=RequestContext(request))

@for_service_providers
def employee_edit_workinghours(request, id):
    workinghours = get_object_or_404(EmployeeWorkingHours, service_provider=request.user.service_provider, id=id)
    employee = ServiceProviderEmployee.objects.get(pk=workinghours.service_provider_employee_id)
    if request.method == 'POST':
        form = EmployeeWorkingHoursForm(request.POST, instance=workinghours, employee=employee)
        form_valid = form.is_valid()

        if form_valid:
            service = form.save(commit=False)
            service.service_provider = request.user.service_provider
            service.service = form.cleaned_data['service']
            # Save
            service.service_provider_employee = employee
            service.save()


            return HttpResponseRedirect(reverse(employee_workinghours, kwargs={'employee_id':employee.id}))
    else:
        form = EmployeeWorkingHoursForm(instance=workinghours, employee=employee)
    return render_to_response('workinghours/employee_edit_workinghours.html', locals(), context_instance=RequestContext(request))

@for_service_providers
def employee_manage_workinghours(request, employee_id):
    workinghours = get_object_or_404(EmployeeWorkingHours, service_provider=request.user.service_provider,id=request.POST.get('workinghours'))
    employee = ServiceProviderEmployee.objects.get(pk=workinghours.service_provider_employee_id)
    if request.method == 'POST':
        if request.POST.get('action') == 'delete':
            workinghours.delete()
    return HttpResponseRedirect(reverse(employee_workinghours, kwargs={'employee_id':employee.id}))

# Absences

@for_service_providers
def myabsences(request):
    absences = request.user.service_provider.absence_set.filter(date_to__gte=datetime.datetime.today())
    return render_to_response('workinghours/myabsences.html', locals(), context_instance=RequestContext(request))

@for_service_providers
def addabsence(request):
    if request.method == 'POST':
        form = AbsenceForm(request.POST)
        if form.is_valid():
            absence = form.save(commit=False)
            absence.service_provider = request.user.service_provider
            absence.save()
            return HttpResponseRedirect(reverse(myabsences))
    else:
        form = AbsenceForm()
    return render_to_response('workinghours/addabsence.html', locals(), context_instance=RequestContext(request))

@for_service_providers
def editabsence(request, id):
    absence = get_object_or_404(Absence, service_provider=request.user.service_provider, id=id)
    if request.method == 'POST':
        form = AbsenceForm(request.POST, instance=absence)
        if form.is_valid():
            form.save()
            return HttpResponseRedirect(reverse(myabsences))
    else:
        form = AbsenceForm(instance=absence)
    return render_to_response('workinghours/editabsence.html', locals(), context_instance=RequestContext(request))

@for_service_providers
def manageabsence(request):
    if request.method == 'POST':
        absence = get_object_or_404(Absence, service_provider=request.user.service_provider, id=request.POST.get('absence'))
        if request.POST.get('action') == 'delete':
            absence.delete()
    return HttpResponseRedirect(reverse(myabsences))
