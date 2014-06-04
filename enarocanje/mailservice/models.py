from django.db import models
from django.utils.translation import ugettext_lazy as _
# Create your models here.
from enarocanje.accountext.models import ServiceProvider
from enarocanje.customers.models import Customer


class MailService(models.Model):
    title = models.TextField(_('title'), null=True)
    message = models.TextField(_('message'), null=True)
    date_time = models.DateField(_('dateTime'), null=False)
    mail_type = models.IntegerField(_('mailType'), null=False)
    number_of_recipients = models.IntegerField(_('recipentsNum'), null=False,default=0)
    recipients = models.TextField(_('recipents'), null=True)
    service_provider = models.ForeignKey(ServiceProvider, null=False, default=0)

    def __unicode__(self):
        return str(self.date_time) + " " + str(self.mail_type) + " Title: " + str(self.title+ " Message: "+str(self.message)+"<br />")

class MailTemplateInfo(models.Model):
    name = models.CharField(_('name'), null=False, max_length=60)
    description = models.TextField(_('description'), null=True)
    path = models.CharField(_('path'), null=False, max_length=60)

class ProviderMailTemplate(models.Model):
    service_provider = models.ForeignKey(ServiceProvider, null=False, default=0)
    header_text = models.TextField(_('headerText'), null=True)
    footer_text = models.TextField(_('footerText'), null=True)
