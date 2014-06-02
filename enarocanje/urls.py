from django.conf import settings
from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.views.generic.base import TemplateView

admin.autodiscover()

urlpatterns = patterns('',
	url(r'^accounts/signup/$', 'enarocanje.accountext.views.singup'),
    url(r'^accounts/signup/provider/$', 'enarocanje.accountext.views.providersignup'),
	url(r'^accounts/profile/$', 'enarocanje.accountext.views.account_profile', name='account_profile'),

	url(r'^', include('enarocanje.service.urls')),
	url(r'^', include('enarocanje.workinghours.urls')),
	url(r'^', include('enarocanje.reservations.urls')),
	url(r'^', include('enarocanje.coupon.urls')),
    url(r'^', include('enarocanje.customers.urls')),
    url(r'^', include('enarocanje.ServiceProviderEmployee.urls')),
    url(r'^', include('enarocanje.mailservice.urls')),

	url(r'^web/(?P<serviceProviderWeb>\w+)/$', 'enarocanje.accountext.views.ServiceProviderWeb', name='provider_web'),

	# External apps
	url(r'^accounts/', include('allauth.urls')),

	# Django admin
	url(r'^admin/doc/', include('django.contrib.admindocs.urls')),
	url(r'^admin/', include(admin.site.urls)),

    # Cookies
    url(r'^cookies/$', TemplateView.as_view(template_name="cookies.html"),name='cookies'),
)

if settings.DEBUG:
	urlpatterns += patterns('',
		(r'^media/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.MEDIA_ROOT, 'show_indexes': True}),
	)
