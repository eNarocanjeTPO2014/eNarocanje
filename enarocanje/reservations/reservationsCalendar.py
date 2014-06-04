import datetime
import json

from django.http import Http404, HttpResponse
from django.utils.translation import ugettext_lazy as _, ugettext

from enarocanje.accountext.models import ServiceProvider
from enarocanje.reservations.models import Reservation
from enarocanje.workinghours.models import Absence, WorkingHours
from enarocanje.ServiceProviderEmployee.models import ServiceProviderEmployee

EVENT_TITLE_CLOSED = _('Closed')
EVENT_TITLE_CLOSED_WHOLE_DAY = _('Closed on this day')
EVENT_TITLE_RESERVED = _('Reserved')

EVENT_CLOSED_COLOR = '#E02D2D'
EVENT_PAUSE_COLOR = '#CCCCCC'
EVENT_RESERVED_COLOR = '#FF8000'

def koledar_json(request):
	try:
		provider = ServiceProvider.objects.get(id=request.GET.get('service_provider_id'))
		start = datetime.datetime.fromtimestamp(int(request.GET.get('start')))
		end = datetime.datetime.fromtimestamp(int(request.GET.get('end')))

		employee_id = request.GET.get('employee_id')
		selectedEmployee=""
		for s in employee_id:
			if s.isdigit():
				selectedEmployee= selectedEmployee+s
		selectedEmployee= int(selectedEmployee)

		service_id= request.GET.get('service_id')
		selectedService=""
		for s in service_id:
			if s.isdigit():
				selectedService= selectedService+s
		selectedService= int(selectedService)

		show_data= request.GET.get('show_data')
		selected_data1=""
		for s in show_data:
			if s.isdigit():
				selected_data1= selected_data1+s
		selected_data1= int(selected_data1)

	except:
		raise Http404

	return HttpResponse(json.dumps(getEvents(provider, start, end, selectedEmployee, selectedService, selected_data1)))

def encodeDatetime(dt):
	if isinstance(dt, datetime.date):
		return dt.isoformat()
	elif isinstance(dt, datetime.datetime):
		return dt.isoformat('T') + 'Z'
	else:
		raise Exception()

def daterange(start_date, end_date):
	for n in range(int((end_date - start_date).days)):
		yield start_date + datetime.timedelta(n)

def getMinMaxTime(provider):
	workinghours = list(provider.working_hours.all())
	if not workinghours:
		return (None, None)
	return (min(wh.time_from for wh in workinghours), max(wh.time_to for wh in workinghours))

def getEvents(provider, start, end, employee_id, service_id, selected_data):
	events = []

	# Get reservation events
	events.extend(getReservations(provider, start, end, employee_id, service_id, selected_data))

	# Get working hours events
	for date in daterange(start.date(), end.date()):
		events.extend(getWorkingHours(provider, date))

	return events

def getReservations(provider, start, end, employee_id, selected_service, selected_data):

	#Vse rezervacije
	if employee_id <= 0 and selected_service <= 0:
		reservations = Reservation.objects.filter(service_provider=provider, date__gte=start, date__lte=end)
	#Filtriraj po zaposlenih
	elif selected_service <= 0 and employee_id > 0:
		reservations = Reservation.objects.filter(service_provider_employee_id=employee_id, service_provider=provider, date__gte=start, date__lte=end)
	#Filtriraj po storitvah
	elif selected_service > 0 and employee_id <= 0:
		reservations = Reservation.objects.filter(service_id=selected_service, service_provider=provider, date__gte=start, date__lte=end)
	#Filtriraj po storitvah ion zaposlenih
	else:
		reservations = Reservation.objects.filter(service_provider_employee_id=employee_id, service_id=selected_service, service_provider=provider, date__gte=start, date__lte=end)


	events = []
	for reservation in reservations:
		dt = datetime.datetime.combine(reservation.date, reservation.time)

		eventTitle=""
		#Prikazi vse
		if selected_data == 0:
			eventTitle= "Customer: " + reservation.user.first_name + reservation.user.last_name +\
						" | Employee: " + reservation.service_provider_employee.first_name + reservation.service_provider_employee.last_name +\
						" | Service: " + reservation.service_name
		#Prikazi stranke
		elif selected_data == 1:
			eventTitle= reservation.user.first_name + reservation.user.last_name
		#Prikazi zaposlene
		elif selected_data == 2:
			eventTitle= reservation.service_provider_employee.first_name + reservation.service_provider_employee.last_name
		#Prikazi storitve
		elif selected_data == 3:
			eventTitle= reservation.service_name


		events.append({
			'title': eventTitle,
			'start': encodeDatetime(dt),
			'end': encodeDatetime(dt + datetime.timedelta(minutes=reservation.service_duration)),
			'color': EVENT_RESERVED_COLOR
		})

	return events

def getWorkingHours(provider, date):
	workinghrs = WorkingHours.get_for_day(provider, date.weekday())
	events = []

	# Check if provider is working on this date
	if workinghrs is None or Absence.is_absent_on(provider, date):
		return [{
			'title': ugettext(EVENT_TITLE_CLOSED_WHOLE_DAY),
			'start': encodeDatetime(date),
			'end': encodeDatetime(date + datetime.timedelta(days=1)),
			'color': EVENT_CLOSED_COLOR
		}]

	# Start
	events.append({
		'title': ugettext(EVENT_TITLE_CLOSED),
		'start': encodeDatetime(date),
		'end': encodeDatetime(datetime.datetime.combine(date, workinghrs.time_from)),
		'color': EVENT_PAUSE_COLOR
	})

	# End
	events.append({
		'title': ugettext(EVENT_TITLE_CLOSED),
		'start': encodeDatetime(datetime.datetime.combine(date, workinghrs.time_to)),
		'end': encodeDatetime(date + datetime.timedelta(days=1)),
		'color': EVENT_PAUSE_COLOR
	})

	for wrkbrk in workinghrs.breaks.all():
		events.append({
			'title': ugettext(EVENT_TITLE_CLOSED),
			'start': encodeDatetime(datetime.datetime.combine(date, wrkbrk.time_from)),
			'end': encodeDatetime(datetime.datetime.combine(date, wrkbrk.time_to)),
			'color': EVENT_PAUSE_COLOR
		})

	return events