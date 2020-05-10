function showResultsTable(domEL, stats){

	var table = "<div class='table-container'><table class='table is-striped is-narrow is-hoverable is-fullwidth'>" +
					'<thead>' +
						'<tr>' +
							'<th>Stats</th>' +
							'<th>Value</th>' +
						'</tr>' +
					'</thead>'+
					'<tbody>'; 

	for (const resultName in stats){
		if (resultName != 'sample'){
			table += '<tr>' +
						'<td>' + resultName + '</td>' +
						'<td>' + stats[resultName] + '</td>' +
					 '</tr>';
		}
	}

	table += '</tbody>' +
			'</table></div>';

	domEL.insertAdjacentHTML('beforeend', table);
}

export {showResultsTable as default};