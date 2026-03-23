fetch("https://neurotron-production.up.railway.app/api/feedback", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message: "test", rating: 5 })
})
.then(res => res.text())
.then(console.log)
.catch(console.error);
