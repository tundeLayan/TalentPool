function toBlock(userId, adminName, csrf) {
	console.log(csrf);
	swal({
		title: `Are you sure you want to block ${adminName}?`,
		type: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#DD6B55',
		confirmButtonText: 'Yes!',
		cancelButtonText: 'No.',
	}).then(async (result) => {
		if (result.value) {
			await fetch(`/admin/block/${userId}`, {
				method: 'PATCH',
				headers: {
					'X-CSRF-TOKEN': csrf,
					// 'Content-Type': 'application/x-www-form-urlencoded',
				},
			}).then(() => {
				swal({
					title: 'Blocked!',
					text: `You have successfully blocked ${adminName}`,
					type: 'success',
				}).then(() => {
					window.location = '/admin/all';
				});
			});
		}
	});
}

function toUnblock(userId, adminName, csrf) {
	swal({
		title: `Are you sure you want to Unblock ${adminName}?`,
		type: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#DD6B55',
		confirmButtonText: 'Yes!',
		cancelButtonText: 'No.',
	}).then(async (result) => {
		if (result.value) {
			await fetch(`/admin/unblock/${userId}`, {
				method: 'PATCH',
				headers: {
					'X-CSRF-TOKEN': csrf,
					// 'Content-Type': 'application/x-www-form-urlencoded',
				},
			});
			swal({
				title: 'Unblocked!',
				text: `You have successfully Unblocked ${adminName}`,
				type: 'success',
			}).then(() => {
				window.location = '/admin/all';
			});
		}
	});
}