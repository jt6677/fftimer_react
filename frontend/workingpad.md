.then(response => {
console.log('Received Stripe token:', response.token);
axios.post('http://10.250.57.37:8000/subscriptions/codes/pay/',
{
token: response.token,
amount: this.state.amount,
email: this.state.email,
referrer: this.state.referrer, // rn name or empty string, filip
},
{
'Content-Type': 'application/json', // header
}
)
// Use the appropiate property in your response to set the values.
// Note that I'm using destructuring assignment
.then(({ code, subscription_days })=> {
this.setState({
code,
subscription_days
});
});
})
.catch(error => {
this.setState({
error: `Your error message.`//Maybe error.message?
});
});
...
