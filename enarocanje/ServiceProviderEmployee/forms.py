from django import forms
from django.core.exceptions import ValidationError
from django.forms import ModelForm
from django.forms.models import inlineformset_factory, BaseInlineFormSet
from django.utils.translation import ugettext_lazy as _

from enarocanje.common.timeutils import is_overlapping
from enarocanje.common.widgets import ClearableImageInput
from enarocanje.common.widgets import BootstrapDateInput
from enarocanje.service.models import Service
from models import ServiceProviderEmployee, ServiceProviderEmployeeImage


# 2.4.2014 RokA; Form for adding and editing Service Provider Employees
class ServiceProviderEmployeeForm(ModelForm):

    #picture = forms.ImageField(widget=ClearableImageInput(), required=False)
    active_from = forms.DateField(widget=BootstrapDateInput(), required=False, label=_('Active from'))
    active_to = forms.DateField(widget=BootstrapDateInput(), required=False, label=_('Active to'))

    class Meta:
        model = ServiceProviderEmployee
        # all fields except service_provider and service (you can only create your own services)
        exclude = ('picture_width', 'picture_height', 'service')
        fields = ('picture', 'active_from','active_to','first_name','last_name','description')

    def __init__(self, *args, **kwargs):
        super(ServiceProviderEmployeeForm, self).__init__(*args, **kwargs)
        #self.fields('service').label = _('Service')
        self.fields['first_name'].label = _('First name')
        self.fields['last_name'].label = _('Last name')
        #self.fields['sex'].label = _('Sex')
        self.fields['description'].label = _('Employee description')
        #self.fields['active_from'].label = _('Employee active from')
        #self.fields['active_to'].label = _('Employee active to')

class ServiceProviderEmployeeImageForm(ModelForm):
	image = forms.ImageField(required=True, label=_('Upload an image'))

	class Meta:
		model = ServiceProviderEmployeeImage
		exclude = ('image_width', 'image_height', 'service_provide_employee', 'delete_image')