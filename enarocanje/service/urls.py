from django.conf.urls import patterns, url

urlpatterns = patterns('enarocanje.service.views',
	url(r'^myservices/$', 'myservices', name='myservices'),
	url(r'^myunconfirmedreservations/managereservation$', 'managereservation', name='managereservation'),
	url(r'^myunconfirmedreservations/managereservationall$', 'managereservationall', name='managereservationall'),
	url(r'^myunconfirmedreservations/$', 'myunconfirmedreservations', name='myunconfirmedreservations'),
	url(r'^myservices/add$', 'add', name='addservice'),
	url(r'^myservices/manage$', 'manage', name='manageservice'),
	url(r'^myservices/edit/(?P<id>\d+)$', 'edit', name='editservice'),


	url(r'^$', 'browse_providers', name='browseproviders'),
	url(r'^services/$', 'browse_services', name='browseservices'),
	url(r'^services/(?P<id>\d+)/comments$', 'service_comments', name='servicecomments'),
    # 16.4.2014 RokA; added urls for browsing employees
    url(r'^employees/$', 'browse_employees', name='browseemployees'),

	url(r'^gallery/(?P<id>\d+)', 'view_gallery', name='gallery')
)
