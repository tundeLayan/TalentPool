const tableTitle = (value) => {
    return ` <label class='employertitle_length_table_title'>${value}</label>`;
}

const filterSearch = () => {
    console.log(totalApplicants);
    // setDataTable(newData);
};

const createTitle = () => {
    const employersTableTitle = document.getElementById('employersTable_length');
    const employersTable = document.getElementById('employersTable');
    employersTable.style.width = 'inherit';
    employersTableTitle.innerHTML = tableTitle('Employers');
}

const createFilterBtn = () => {
    const [jobTable_filter] = document.getElementsByClassName('dataTables_filter');

    const label = document.createElement('label');
    const select = document.createElement('select');
    select.className = 'custom-select custom-select-sm form-control form-control-sm';

    const option = document.createElement('option');
    const option1 = document.createElement('option');
    option.appendChild( document.createTextNode( 'All Categories' ) );
    option1.appendChild( document.createTextNode( 'None' ) );
    // const textNode = document.createTextNode('Filter');
    select.appendChild(option);
    select.appendChild(option1);
    // button.setAttribute('onclick', 'showFilterModal()');
    label.appendChild(select);

    // jobTable_filter.appendChild(label);

    const newPosition = jobTable_filter.children.length - 1;
    jobTable_filter.insertBefore(label, jobTable_filter.children[newPosition]);
};

const formatData = () => {
    const newData = [];
    
    setDataTable(newData);
    setTimeout(createFilterBtn, 100);
    setTimeout(createTitle, 100);
    setTimeout(setInputInDom, 100);
};

const setInputInDom = () => {
    $('div.dataTables_wrapper div.dataTables_filter input').attr('placeholder', $('<textarea />').html("").html()  + "Search for employers");
};

const setDataTable = () => {
    $(document).ready(function() {
        $('#employersTable').DataTable();
    } );
};

formatData();