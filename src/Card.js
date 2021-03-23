function Card(props){
    return(<div>
        <label>{props.dt_txt}</label>
        <br/>
        <label>{props.weather[0]["main"]}</label>
    </div>)
}