

elInput.addEventListener("keyup", function(evt) {
    if(evt.keyCode === 13){
        evt.preventDefault()
        let request = elInput.value;

        let render = function(req) {
            fetch(`https://goweather.herokuapp.com/weather/${request}`)
            .then((response) => {
              return response.json();
            })
            .then((data) => {
                return creat(data)
            });
        }
        render();
    }
})