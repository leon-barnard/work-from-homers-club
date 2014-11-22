// URL beginning and end, which will be used with the key
// To give Tabletop a URL
var public_spreadsheet_url = 'https://docs.google.com/spreadsheets/d/1V-rexUbAQicJcLh8yhGffAs0g7f6xO_uJKFjIh6vC_g/pubhtml';
// var public_spreadsheet_url = 'https://docs.google.com/spreadsheets/d/13H7OWvEB9jFI95Xe918UDVak9dxfkHGp0p4t4Didf-U/pubhtml';

// Template sources and what DIVs they will appear in
var templates = [
    {
        "templatesource": "#datatable-template",
        "templatehtml": "#searchable-table tbody",
        "sheet": "Sheet1"
    }
];

// DataTables formatting options
// More options: http://datatables.net/plug-ins/sorting

// Formatted numbers: i.e. numbers with commas
jQuery.extend( jQuery.fn.dataTableExt.oSort, {
    "formatted-num-pre": function ( a ) {
        a = (a === "-" || a === "") ? 0 : a.replace( /[^\d\-\.]/g, "" );
        return parseFloat( a );
    },
    "formatted-num-asc": function ( a, b ) {
        return a - b;
    },
    "formatted-num-desc": function ( a, b ) {
        return b - a;
    }
});
// Currency
jQuery.extend( jQuery.fn.dataTableExt.oSort, {
    "currency-pre": function ( a ) {
        a = (a==="-") ? 0 : a.replace( /[^\d\-\.]/g, "" );
        return parseFloat( a );
    },
    
    "currency-asc": function ( a, b ) {
        return a - b;
    },
    
    "currency-desc": function ( a, b ) {
        return b - a;
    }
});
// Percentages
jQuery.extend( jQuery.fn.dataTableExt.oSort, {
    "percent-pre": function ( a ) {
        var x = (a == "-") ? 0 : a.replace( /%/, "" );
        return parseFloat( x );
    },
 
    "percent-asc": function ( a, b ) {
        return ((a < b) ? -1 : ((a > b) ? 1 : 0));
    },
 
    "percent-desc": function ( a, b ) {
        return ((a < b) ? 1 : ((a > b) ? -1 : 0));
    }
});

// Load up the DataTable
function loadDataTable() {
    // Load Datatables after Tabletop is loaded
//     $('#searchable-table').dataTable();
    $('#searchable-table').dataTable({
        // Fix thead to top of page when scrolling past it
        "initComplete": function(settings, json) {
            $('#searchable-table').show();
        },
        "order": [[ 3, "asc" ]]
    });
// Close loadDataTable
};

// Use Handlebars to load data from Tabletop to page
function loadToDOM(tabletop_data, tabletop) {
    // Loop through templates
    _.each(templates, function(element, num_templates) {
    	// Grab HTML of template and compile with Handlebars
    	var template_html = element['templatehtml'];    
    	var source = $(element["templatesource"] + "").html();
    	var sheet = element["sheet"];
        var handlebarscompile = Handlebars.compile(source);

		// Render the templates onto page
		$(template_html).append(handlebarscompile( tabletop.sheets(sheet) ));
	// Close each statement
    }, this);

    loadDataTable();
}


// Pull data from Google spreadsheet via Tabletop
function initializeTabletopObject(){
	Tabletop.init({
    	key: public_spreadsheet_url,
    	callback: loadToDOM,
    	simpleSheet: true,
    	debug: true
    });
}

// Load Tabletop
initializeTabletopObject();