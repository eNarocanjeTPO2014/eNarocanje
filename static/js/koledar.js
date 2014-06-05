
$(document).ready(function(){

    renderCalendar()

    //Osvezi podatke glede na vrednost iz dropdown menuja zaposleni
    $('#select_employee').change(function(){
        refreshCalendar()
    })

    //Osvezi podatke glede na vrednost iz dropdown menuja storitve
    $('#select_service').change(function(){
        refreshCalendar()
    })

    //Osvezi podatke, ki se prikazujejo
    $('#show_on_calendar_sel').change(function(){
        refreshCalendar()
    })
})

function refreshCalendar ()
{
    $('#calendar').fullCalendar( 'removeEventSource', {url: document.getElementById("EventsUrl").value})

        $('#calendar').fullCalendar( 'addEventSource', {
            url: document.getElementById("EventsUrl").value,
            type: 'GET',
            data: readParameters()
        })
}


function readParameters ()
{
     return {
         service_provider_id: document.getElementById("providerId").value ,
         employee_id: document.getElementById('select_employee').options[document.getElementById('select_employee').selectedIndex].value,
         service_id: document.getElementById('select_service').options[document.getElementById('select_service').selectedIndex].value,
         show_data: document.getElementById('show_on_calendar_sel').options[document.getElementById('show_on_calendar_sel').selectedIndex].value
     }
}


function renderCalendar()
{
    gumbi= document.getElementById('calendar_trans').value
    gumbi= gumbi.split(" ")

    dnevi= document.getElementById('day_trans').value
    dnevi= dnevi.split(" ")

    dnevis= document.getElementById('day_trans_s').value
    dnevis= dnevis.split(" ")

    $('#calendar').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },

        /* sets the current view */
        defaultView: (document.width >= 800) ? 'agendaWeek' : 'agendaDay',


        /* translation */
        buttonText:{
            today: gumbi[0],
            month: gumbi[1],
			week: gumbi[2],
			day: gumbi[3]
        },

        dayNames: [dnevi[0], dnevi[1], dnevi[2], dnevi[3], dnevi[4], dnevi[5], dnevi[6]],
        dayNamesShort:[dnevis[0], dnevis[1], dnevis[2], dnevis[3], dnevis[4], dnevis[5], dnevis[6]],


        editable: false,
        allDayDefault: false,
        allDaySlot: false,
        height: 100000,
        slotMinutes: 15,

        lazyFetching: true,


        /* events data */
        events: {
            url: document.getElementById("EventsUrl").value,
            type: 'GET',
            data: readParameters()
        },
        eventRender: function (event, element) {
            element.attr('href', 'javascript:void(0);');
            element.attr('onclick', 'openModal("' + event.title + '","' + event.description + '","' + event.url + '");');
        }


    })
}
function openModal(title, info, url) {
    alert(title);
}