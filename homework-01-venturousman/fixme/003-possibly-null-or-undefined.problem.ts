const searchParams = new URLSearchParams(window.location.search); // window is only available in browser environments

const id = searchParams.get("id");

console.log(id?.toUpperCase()); // or if (id) { console.log(id.toUpperCase()); }
