from django.conf.urls import patterns, url

urlpatterns = patterns('enarocanje.ServiceProviderEmployee',
	url(r'^myemployees/$', 'views.myemployees', name='myemployees'),
    url(r'^myemployees/add$', 'views.add', name='addemployee'),
	url(r'^myemployees/edit/(?P<id>\d+)$', 'views.edit', name='editemployee'),
    )
