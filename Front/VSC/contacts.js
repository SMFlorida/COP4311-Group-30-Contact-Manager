const URL_BASE = 'http://spadecontactmanager.com/LAMPAPI';
const API_EXTENSION = 'php';
const DEBUG = true;
const CONTACTS_PER_PAGE = 5;

var token;
var userId = 0;
var searchQry = ''
var page = 0;
var loadedContacts = [];
var container;

function getInt(val, def = 0) {
	if (!isNaN(val) && parseInt(Number(val) == val) && !isNaN(parseInt(val, 10)))
		return parseInt(val, 10);
	else return def;
}

// Handle page load
$(document).ready(function () {
	var urlParams = new URLSearchParams(window.location.search);
	token = Cookies.get("token");

	page = urlParams.has("page") && urlParams.get("page") >= 0 ? urlParams.get("page") : 0;
	searchQry = urlParams.has("search") ? urlParams.get("search") : '';

	// Change Auth page if not logged in
	if (!token && !DEBUG) {
		alert("You must log in to view this page!");
		window.location.pathname = "";
	}

	// Add event listeners to header buttons
	$('#logoutBtn').click(doLogout);
	$('#addBtn').click(doCreate);

	// // Load Pagination
	// // page = faker.random.number(100) + 10;
	// page = 1;
	// displayPagination(page + 3, 5);
	// // displayPagination(page, page + faker.random.number(100) + 1);
	// // loadPagination(token, searchQry, page);

	// Load Contacts on page render
	loadContacts(token, searchQry, page);
});


function doLogout(e) {
	Cookies.remove("userId");
	alert("Logged out successfuly!");
	window.location.pathname = "";
}

function doCreate(e) {
	alert("Create contact form does not exist yet");

	// window.location.pathname = "/create.html";
}

function loadContacts(token, search, page) {
	$.ajaxSetup({
		headers: {
			'x-access-token': token
		}
	});

	let uri = `${URL_BASE}/searchcontact${API_EXTENSION ? "." : ""}${API_EXTENSION}`

	$.get(uri, { search: search, page: page })
		.done(function (res) {
			// Display contacts
			displayContacts(res.contacts);
			displayPagination(page, res.total_pages ? res.total_pages : page + faker.random.number(4));
		})
		.fail(function (jqXHR, textStatus, errorThrown) {
			// TODO : handle error
			errMsg = jqXHR.responseJSON && jqXHR.responseJSON.error ? jqXHR.responseJSON.error + "😢" : "An error has occured 😟";
			console.log(jqXHR); console.log(textStatus); console.log(errorThrown);

			// Display error
			// showError($("#signup-error"), errMsg)
		});
}



function displayContacts(contacts) {
	var contact_list = $("#contact-list");

	contacts.forEach(contact => {
		let FULL_NAME = `${contact.firstName} ${contact.lastName}`;

		// HTML list item
		var contact_li;

		// TODO : add buttons to the <li>'s
		// Unique id for buttons (#delete{contact.id}), (#edit{contact.id})
		// Bind delete with this contact.id
		// Bind edit with this contact.id

		// Generate contact HTML
		contact_li = `
			<li class="list-group-item">
				<div class="row w-100">
					<div class="col-12 col-sm-6 col-md-3 px-0">
						<img src="${faker.image.avatar()}"
							alt="${FULL_NAME}" class="rounded-circle mx-auto d-block img-fluid">
					</div>
					<div class="col-12 col-sm-6 col-md-9 text-center text-sm-left">
						<label class="name lead">${FULL_NAME}</label>
						<br>
						<span class="fa fa-map-marker fa-fw text-muted" data-toggle="tooltip" title=""
							data-original-title="${contact.address}"></span>
						<span class="text-muted">${contact.address}</span>
						<br>
						<span class="fa fa-phone fa-fw text-muted" data-toggle="tooltip" title=""
							data-original-title="${contact.phone}"></span>
						<span class="text-muted small">${contact.phone}</span>
						<br>
						<span class="fa fa-envelope fa-fw text-muted" data-toggle="tooltip"
							data-original-title="" title=""></span>
						<span class="text-muted small text-truncate">${contact.email}</span>
					</div>
				</div>
			</li>
		`;

		// console.log(contact_li);
		contact_list.append(contact_li);
	});
}

function displayPagination(page, total_pages)
{
	let pagination_ul = $("#pagination ul");
	let pagination_content = [];
	pagination_ul.empty();

	let first_page = page > 3 ? page - 3 : 1;
	let last_page = page > 3 ? page + 3 : 6;

	disabled = page < 6;
	pagination_content.push(`
		<li>
			<a class="page-first ${disabled ? ' disabled' : ''}" href="javascript:;" ${disabled ? '' : 'onclick="changePage(0)"'}><<</a>
		</li>
	`);

	for (let p = first_page; p <= last_page; p++)
	{
		disabled = p > total_pages;
		pagination_content.push(`
			<li class="page-number${page==p && !disabled ? ' active':''} ${disabled ? ' disabled' : ''}">
				<a href="javascript:;" ${disabled ? '' : `onclick="changePage(${p})"`}>${p}</a>
			</li>
		`);
	}
	
	disabled = total_pages <= last_page;
	pagination_content.push(`
		<li>
			<a class="page-last ${disabled ? ' disabled' : ''}" href="javascript:;" ${disabled ? '' : ` onclick="changePage(${total_pages})"` }>>></a>
		</li>`);

	pagination_ul.append(pagination_content.join("\n"));
}

function changePage(page)
{
	if (history.pushState) {
		var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname
		+ `?search=${searchQry}` + `&page=${page}`;
		window.history.pushState({path:newurl},'',newurl);
	}

	loadContacts(token, searchQry, page);
}



	// // List of random contacts
	// // let contacts = [...Array(CONTACTS_PER_PAGE)].map(() => ({
	// // 	id: faker.random.number(),
	// // 	firstName: faker.name.firstName(),
	// // 	lastName: faker.name.lastName(),
	// // 	phone: faker.phone.phoneNumberFormat(1),
	// // 	address: faker.address.streetAddress(),
	// // 	email: faker.internet.email()
	// // }));

	// console.log("Contacts", contacts);

	// // let contacts = [
	// // 	{
	// // 		"name" : 
	// // 	}
	// // ];

	// // $.get(uri, JSON.stringify(payload))
	// // 	.done(function (res){
	// // 		console.log(res);
	// // 		contacts = res;
	// // 	})
	// // 	.fail(function (jqXHR, textStatus, errorThrown) {
	// // 		// TODO : handle error
	// // 		errMsg = jqXHR.responseJSON && jqXHR.responseJSON.error ? jqXHR.responseJSON.error + "😢" : "An error has occured 😟";
	// // 		console.log(jqXHR); console.log(textStatus); console.log(errorThrown);

	// // 		// Display error
	// // 		showError($("#signup-error"), errMsg)
	// // 	});

	// // payload = {userId: userId, page: page}
	// // alert("getContacts() not functional yet");