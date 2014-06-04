from django.conf.urls import patterns, url

urlpatterns = patterns('enarocanje.reservations',
	url(r'^myreservations$', 'views.myreservations', name='myreservations_calendar'),
    url(r'^allreservations/$', 'views.allreservations', name='myreservations_table'),
    url(r'^allreservations/this$', 'views.allreservations_this', name='myreservations_thisweek'),
    url(r'^allreservations/next$', 'views.allreservations_next', name='myreservations_nextweek'),
	url(r'^myreservations/gcal/$', 'gcal.edit', name='gcal'),
	url(r'^myreservations/gcal/callback$', 'gcal.callback', name='gcalcallback'),

	url(r'^services/(?P<id>\d+)$', 'views.reservation2', name='service2'),
    # 3.5.2014 RokA; try to pass employee_id to view.reservation
    url(r'^services/(?P<id>\d+)/(?P<employee_id>\d+)$', 'views.reservation', name='service'),
	# RokA; and same for next step url
	url(r'^services/(?P<id>\d+)/reservation$', 'views.reservation2', name='reservation2'),
    url(r'^services/(?P<id>\d+)/(?P<employee_id>\d+)/reservation$', 'views.reservation', name='reservation'),
	url(r'^calendar.json$', 'rcalendar.calendarjson', name='calendarjson'),
	url(r'^dogodki.json$', 'reservationsCalendar.koledar_json', name='dogodki'),
)
