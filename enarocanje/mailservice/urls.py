from django.conf.urls import patterns, url

urlpatterns = patterns('enarocanje.mailservice.views',
    url(r'^mynotifications/$', 'mynotifications', name='mynotifications'),
	url(r'^sendmail/$', 'sendmail', name='sendmail')
)
