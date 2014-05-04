from django.conf.urls import patterns, url

urlpatterns = patterns('enarocanje.customers',
	url(r'^mycustomers/$', 'views.mycustomers', name='mycustomers'),
    url(r'^mycustomers/add$', 'views.add', name='addcustomer'),
	url(r'^mycustomers/edit/(?P<id>\d+)$', 'views.edit', name='editcustomer'),
    url(r'^mycustomers/(?P<id>\d+)/reservations$', 'views.customer_reservations', name='customerreservations'),
    url(r'^mycustomers/manage$', 'views.manage', name='manageattend'),
    )
