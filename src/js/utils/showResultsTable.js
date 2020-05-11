function showResultsTable(domEL, stats){
	const table_div = document.createElement("div");
	table_div.classList.add('table-container');
	const table = document.createElement("table");
	table.classList.add('table', 'is-striped', 'is-narrow', 'is-hoverable', 'is-fullwidth');
	const thead = document.createElement("thead");
	const tr = document.createElement("tr");
	const th_stats = document.createElement("th");
	const th_stats_text = document.createTextNode("Stats");
	th_stats.appendChild(th_stats_text);
	const th_value = document.createElement("th");
	const th_value_text = document.createTextNode("Value");
	th_value.appendChild(th_value_text);
	tr.appendChild(th_stats);
	tr.appendChild(th_value);
	thead.appendChild(tr);
	table.appendChild(thead);

	const tbody = document.createElement("tbody");

	for (const resultName in stats){
		if (resultName != 'sample'){
			const tr_res = document.createElement("tr");
			const td_resName = document.createElement("td");
			const td_resName_text = document.createTextNode(resultName);
			const td_resValue = document.createElement("td");
			const td_resValue_text = document.createTextNode(stats[resultName]);

			td_resValue.appendChild(td_resValue_text);
			td_resName.appendChild(td_resName_text);

			tr_res.appendChild(td_resValue);
			tr_res.appendChild(td_resName);

			tbody.appendChild(tr_res);
		}
	}
	table.appendChild(tbody);
	table_div.appendChild(table);
	domEL.appendChild(table_div);
}

export {showResultsTable as default};