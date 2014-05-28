import datetime

from django.conf import settings
from django.db import models
from django.core.exceptions import ObjectDoesNotExist
from django.utils.translation import ugettext_lazy as _, ugettext

from enarocanje.accountext.models import ServiceProvider, User
from enarocanje.service.models import Service
# Create your models here.

# 2.4.2014 RokA; added class for Service Provider Employees
class ServiceProviderEmployee(models.Model):
    MALE = 'm'
    FEMALE = 'f'
    SEX_SERVICE_CHOICES = (
        (MALE, _('Male')),
        (FEMALE, _('Female')),
    )

    service_provider = models.ForeignKey(ServiceProvider, related_name='employees')
    service = models.ForeignKey(Service, related_name='employees')
    first_name = models.CharField(_('first_name'), max_length=100)
    last_name = models.CharField(_('last_name'), max_length=100)
    #sex = models.CharField(_('sex'), choices=SEX_SERVICE_CHOICES, max_length=1, null=True, blank=True)
    description = models.TextField(_('description'), null=True, blank=True)
    active_from = models.DateField(_('active_from'), null=True, blank=True)
    active_to = models.DateField(_('active_to'), null=True, blank=True)

    picture = models.ImageField(upload_to='images', width_field='picture_width', height_field='picture_height', null=True, blank=True)
    picture_width = models.PositiveIntegerField(null=True)
    picture_height = models.PositiveIntegerField(null=True)

    def __unicode__(self):
		return u"{0} {1}".format(self.first_name, self.last_name)

    def is_active(self):
		return self.active_from <= datetime.date.today() <= self.active_to

    def picture_url(self):
        if self.picture:
            return self.picture.url
        return settings.STATIC_URL + 'img/default.png'

    def picture_absolute_url(self):
		return settings.BASE_URL + self.picture_url()


class ServiceProviderEmployeeImage(models.Model):
	image = models.ImageField(upload_to='images', width_field='image_width', height_field='image_height', null=False, blank=False)
	image_width = models.PositiveIntegerField(null=True)
	image_height = models.PositiveIntegerField(null=True)
	delete_image = models.BooleanField()
	service_provider_employee = models.ForeignKey(ServiceProviderEmployee, null=False)

