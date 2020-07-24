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

// const createFilterBtn = () => {
//     const filterDropdown = `<label>Show <select name="employersTable_length" aria-controls="employersTable" class="custom-select custom-select-sm form-control form-control-sm"><option value="10">10</option><option value="25">25</option><option value="50">50</option><option value="100">100</option></select></label>`;
//     const [jobTable_filter] = document.getElementsByClassName('dataTables_filter');
//     const newPosition = jobTable_filter.children.length - 1;
//     jobTable_filter.insertBefore(filterDropdown, jobTable_filter.children[newPosition]);
// };

const formatData = () => {
    const newData = [];
    let count = 0;

    const individual1 = {
        status: 'Open',
        name: 'John Ben',
        phone: '08034356453',
        email: 'jh@benny.com',
        type: 'Individual',
        date_joined: '11-07-2020',
        verification_status: 'Pending',
        details: {},
    };

    const individual2 = {
        status: 'Open',
        name: 'Le Bron',
        phone: '09088561453',
        email: 'iobami@ibm.com',
        type: 'Individual',
        date_joined: '13-03-2020',
        verification_status: 'Pending',
        details: {},
    };

    const company1 = {
        status: 'Open',
        name: 'Google',
        phone: '09088561453',
        email: 'Uhy@google.com',
        type: 'Company',
        date_joined: '27-09-2019',
        verification_status: 'Pending',
        details: {},
    };

    const company2 = {
        status: 'Open',
        name: 'Flutterwave',
        phone: '09033552189',
        email: 'support@flutterwave.com',
        type: 'Company',
        date_joined: '23-07-2020',
        verification_status: 'Pending',
        details: {},
    };

    for (count; count < 100; count += 1) {

        if (count % 5 === 0) {
            newData.push(formatEmployerArray(individual1));
        }
        else if (count % 4 === 0) {
            newData.push(formatEmployerArray(company2));
        }
        else if (count % 3 === 0) {
            newData.push(formatEmployerArray(individual2));
        }
        else if (count % 2 === 0) {
            newData.push(formatEmployerArray(individual2));
        }
        else {
            newData.push(formatEmployerArray(company1));
        }

    }

    setDataTable(newData);
    setTimeout(createFilterBtn, 100);
    setTimeout(createTitle, 100);
    setTimeout(setInputInDom, 100);
};

// const searchInput = () => {
//     return `<input type="search" class="form-control form-control-sm" placeholder="Search for employers" aria-controls="employersTable">`;
// };

// const setInputInDom = () => {
//     const [ , employersTable_filter] = document.querySelectorAll('#employersTable_filter label');
//     console.log(employersTable_filter);
//     employersTable_filter.innerHTML = searchInput();
// };

const setInputInDom = () => {
    $('div.dataTables_wrapper div.dataTables_filter input').attr('placeholder', $('<textarea />').html("").html()  + "Search for employers");
};

const formatEmployerArray = ({status, name, phone, email, type, date_joined, verification_status}) => {
    return [
        (status === '') ? 'No Status' : status,
        (name === '') ? 'n/A' : name,
        (phone === '') ? 'n/A' : phone,
        (email === '') ? 'No Email' : email,
        (type === '') ? 'n/A' : type,
        (date_joined === '') ? 'n/A' : date_joined,
        (verification_status === '') ? 'n/A' : verification_status,
        'View More',
    ];
};

const setDataTable = (dataSet) => {
    $(document).ready(function() {
        $('#employersTable').DataTable( {
            data: dataSet,
            columns: [
                { title: "Status" },
                { title: "Name" },
                { title: "Phone" },
                { title: "Email" },
                { title: "Type" },
                { title: "Date Joined" },
                { title: "Verification" },
                { title: "Other Info" },
            ]
        } );
    } );
};

formatData();