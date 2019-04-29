function loadTable(searchTerm) {

	$.ajax({
		type: "get",
		url: "https://en.wikipedia.org/w/api.php?action=query&list=search&utf8=&format=json&srlimit=500",
		dataType: 'jsonp',
		data: "&srsearch=" + searchTerm,
		success: function (data) {
			if (data.query.search[0].title == 0) { data = ""; }
			var html = "";
			for (let i = 0; i < data.query.search.length; i++) {
				html += '<tr><td>' + data.query.search[i].title + '</td><td>' + data.query.search[i].pageid + '</td><td>' +
					data.query.search[i].size + '</td><td>' + data.query.search[i].wordcount + '</td><td>' + data.query.search[i].snippet + '</td></tr>'
			}
			$("#searchResults").append(html)
			getPagination('#searchResults');
		}
	});
}

function setupSearch(searchTerm) {
	$("#searchTerm").val(searchTerm);
	$('#searchTerm').on('keyup', function (e) {
		if (e.keyCode == 13) {
			$("#searchResults tbody").empty()
			loadTable($("#searchTerm").val());
		}
	});

}

function getPagination(table) {

	var lastPage = 1;

	$('#maxRows').on('change', function (evt) {
		lastPage = 1;
		$('.pagination').find("li").slice(1, -1).remove();
		var trnum = 0;
		var maxRows = parseInt($(this).val());

		if (maxRows == 5000) {

			$('.pagination').hide();
		} else {

			$('.pagination').show();
		}
		// numbers of rows 
		var totalRows = $(table + ' tbody tr').length;
		$(table + ' tr:gt(0)').each(function () {
			trnum++;
			if (trnum > maxRows) {

				$(this).hide();
			} if (trnum <= maxRows) { $(this).show(); }
		});
		if (totalRows > maxRows) {
			var pagenum = Math.ceil(totalRows / maxRows);
			//	numbers of pages 
			for (var i = 1; i <= pagenum;) {
				$('.pagination #prev').before('<li data-page="' + i + '">\
				  <span>'+ i++ + '<span class="sr-only">(current)</span></span>\
				</li>').show();
			}
		}
		$('.pagination [data-page="1"]').addClass('active');
		$('.pagination li').on('click', function (evt) {
			evt.stopImmediatePropagation();
			evt.preventDefault();
			var pageNum = $(this).attr('data-page');	// get it's number

			var maxRows = parseInt($('#maxRows').val());			// get Max Rows from select option

			if (pageNum == "prev") {
				if (lastPage == 1) { return; }
				pageNum = --lastPage;
			}
			if (pageNum == "next") {
				if (lastPage == ($('.pagination li').length - 2)) { return; }
				pageNum = ++lastPage;
			}

			lastPage = pageNum;
			var trIndex = 0;
			$('.pagination li').removeClass('active');
			$('.pagination [data-page="' + lastPage + '"]').addClass('active');
			$(table + ' tr:gt(0)').each(function () {
				trIndex++;
				if (trIndex > (maxRows * pageNum) || trIndex <= ((maxRows * pageNum) - maxRows)) {
					$(this).hide();
				} else { $(this).show(); }
			});
		});

	}).val(50).change();
}

$(function () {
	// Just to append id number for each row  
	$('table tr:eq(0)').prepend('<th> ID </th>')

	var id = 0;

	$('table tr:gt(0)').each(function () {
		id++
		$(this).prepend('<td>' + id + '</td>');
	});
})
