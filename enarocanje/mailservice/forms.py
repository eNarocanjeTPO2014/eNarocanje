from bootstrap_toolkit.widgets import BootstrapTextInput
from django import forms
from django.forms import Textarea
from django.utils.translation import ugettext_lazy as _

__author__ = 'user'


class EmailForm(forms.Form):
    subject = forms.CharField(widget=BootstrapTextInput(attrs={'style':'width:98%'}), label=_('Title'), required=True)
    message = forms.CharField(widget=Textarea(attrs={'style':'width:98%;max-width:98%'}), label=_('Text'), required=True)

class NotificationConditionsForm(forms.Form):
    regular_customers = forms.ChoiceField(widget=forms.Select(attrs={'style':'width:50%'}), label=_('Send email to my customer who'), required=True)
    specific_service = forms.ChoiceField(widget=forms.Select(attrs={'style':'width:50%'}), label=_('Send email to my customer who attended'), required=True)
    customers_liking_discounts = forms.ChoiceField(widget=forms.Select(attrs={'style':'width:50%'}), label=_('Send email to my customer who used'), required=True)

