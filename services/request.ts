const GET = async (url: string) => {
	return await fetch(url, {
		method: 'GET',
	});
}

const POST = async (url: string, data?: Object) => {
	return await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    })
}

export const request = {
	GET,
	POST
}