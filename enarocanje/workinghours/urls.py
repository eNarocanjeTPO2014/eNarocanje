from django.conf.urls import patterns, url

urlpatterns = patterns('enarocanje.workinghours.views',
	url(r'^myworkinghours/$', 'myworkinghours', name='myworkinghours'),
	url(r'^myworkinghours/add$', 'add', name='addworkinghours'),
	url(r'^myworkinghours/edit/(?P<id>\d+)$', 'edit', name='editworkinghours'),
	url(r'^myworkinghours/manage$', 'manage', name='manageworkinghours'),

    # 1.6.2014 RokA; add views for managing employee working hours
    url(r'^employeeworkinghours/(?P<employee_id>\d+)$', 'employee_workinghours', name='employeeworkinghours'),
	url(r'^employeeworkinghours/add/(?P<employee_id>\d+)$', 'employee_add_workinghours', name='employeeaddworkinghours'),
	url(r'^employeeworkinghours/edit/(?P<id>\d+)$', 'employee_edit_workinghours', name='employeeeditworkinghours'),
	url(r'^employeeworkinghours/manage/(?P<employee_id>\d+)$', 'employee_manage_workinghours', name='employeemanageworkinghours'),

	url(r'^myabsences/$', 'myabsences', name='myabsences'),
	url(r'^myabsences/add$', 'addabsence', name='addabsence'),
	url(r'^myabsences/edit/(?P<id>\d+)$', 'editabsence', name='editabsence'),
	url(r'^myabsences/manage$', 'manageabsence', name='manageabsence'),
)
