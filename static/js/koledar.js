
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
    $('#calendar').fullCalendar({
        header: {
            left: 'prev,next today',
            center: '',
            right: 'agendaWeek,agendaDay'
        },

        /* sets the current view */
        defaultView: (document.width >= 800) ? 'agendaWeek' : 'agendaDay',


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
        }
    })
}