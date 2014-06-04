from django import template
from django.utils.safestring import mark_safe

register = template.Library()

@register.filter
def picturewh(service_provider_employee, wh):
	max_width, max_height = map(int, wh.split(','))
	if service_provider_employee.picture:
		width, height = service_provider_employee.picture_width, service_provider_employee.picture_height
	else:
		width, height = 225, 225  # default.png
	if width > max_width:
		height *= float(max_width) / width
		width = max_width
	if height > max_height:
		width *= float(max_height) / height
		height = max_height
	return mark_safe('width="%d" height="%d"' % (width, height))
