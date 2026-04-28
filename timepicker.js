/*!
 * Timepicker
 * https://github.com/andreazorzi/Timepicker
 * 
 * Author: Andrea Zorzi <info@zorziandrea.com>
 * License: MIT
 * 
 * Version: 1.0.8
 */

import default_lang from "./locale/it.js";
window.default_lang = default_lang;

export default class Timepicker{
    #placeholder = null;
    #element = null;
    #container = null;
    #selectors = null;
    #hour_range = {
        from: 0,
        to: 23
    }
    #options = {
        disabled: true,
        selected:{
            hour: -1,
            minute: -1
        },
        lang: default_lang,
        am_pm: false,
        custom_classes: {
            selectors: "",
        }
    }
    
    constructor(element_selector, options){
        let element = document.querySelector(element_selector);
        
        if(element == null){
            console.warn(`Element ${element_selector} not found`);
            return;
        }
        
        this.#placeholder = element;
        this.#options = { ...this.#options, ...options };
        
        this.#init();
    }
    
    #init(){
        // Wrap element
        this.#container = document.createElement("div");
        this.#container.classList.add("timepicker");
        this.#placeholder.parentNode.insertBefore(this.#container, this.#placeholder);
        this.#container.appendChild(this.#placeholder);
        
        this.#element = document.createElement("input");
        this.#element.type = "hidden";
        this.#element.name = this.#placeholder.name;
        this.#element.value = this.#placeholder.value;
        this.#container.appendChild(this.#element);
        
        this.#placeholder.removeAttribute("name");
        
        this.#placeholder.classList.add("timepicker-input");
        
        // Configurations
        this.#placeholder.readOnly = this.#options.disabled;
        
        if(this.#options.am_pm){
            this.#hour_range.from = 1;
            this.#hour_range.to = 12;
        }
        
        // Add selectors to container
        this.#container.insertAdjacentHTML("beforeend", this.#getSelectors());
        this.#selectors = this.#container.querySelector(".timepicker-selectors");
        
        // Add listeners
        this.#placeholder.addEventListener("click", () => {
            this.open();
        });
        
        document.addEventListener("click", this.#checkOutsideClick.bind(this), false);
        
        this.#container.querySelectorAll('select').forEach(item => {
            item.addEventListener('change', this.#setHours.bind(this));
        })
        
        // Set initial values
        this.#setHours(null, true);
    }
    
    #checkOutsideClick(e){
        let click_outside = true;
        
        for (var el=e.target; el && el!=this; el=el.parentNode){
            if(el === this.#container){
                click_outside = false;
            }
            
            if(el.tagName == "HTML"){
                break;
            }
        }
        
        if(click_outside){
            this.close();
        }
    }
    
    open(){
        this.#selectors.classList.add("show");
    }
    
    close(){
        this.#selectors.classList.remove("show");
    }
    
    getHour(){
        return this.#container.querySelector(".timepicker-hours select").value;
    }
    
    getMinute(){
        return this.#container.querySelector(".timepicker-minutes select").value;
    }
    
    getAmPm(){
        return this.#container.querySelector(".timepicker-ampm select").value
    }
    
    getFormattedTime(){
        let hour = this.getHour();
        let minute = this.getMinute();
        
        let time = hour == "" || minute == "" ? "" : `${hour < 10 ? "0" + hour : hour}:${minute < 10 ? "0" + minute : minute}`;
        
        if(this.#options.am_pm && time != ""){
            time += " " + this.getAmPm();
        }
        
        return time;
    }
    
    setTime(time){
        this.#placeholder.value = time;
        this.#setSelectorHours();
        this.#updateHiddenInput();
    }
    
    #setHours(e, init = false){
        if(init && this.#placeholder.value != ""){
            // time = this.#placeholder.value;
            this.#setSelectorHours();
        }
        
        this.#placeholder.value = this.getFormattedTime();
        this.#updateHiddenInput();
    }
    
    #updateHiddenInput(){
        if(this.getHour() === "" || this.getMinute() === ""){
            this.#element.value = "";
            return;
        };
        
        let hour = parseInt(this.getHour());
        let minute = parseInt(this.getMinute());
        
        if(this.#options.am_pm && this.getAmPm() == "PM" && hour < 12){
            hour += 12;
        }
        else if(this.#options.am_pm && this.getAmPm() == "AM" && hour == 12){
            hour = 0;
        }
        
        this.#element.value = `${hour < 10 ? "0" + hour : hour}:${minute < 10 ? "0" + minute : minute}`;
    }
    
    #setSelectorHours(){
        let time = this.#placeholder.value.split(":");
        let time2 = (time[1] ?? "").split(" ");
        
        let hour = parseInt(time[0]);
        let minutes = parseInt(time2[0] ?? "");
        
        this.#container.querySelector(".timepicker-hours select").value = hour;
        this.#container.querySelector(".timepicker-minutes select").value = minutes;
        
        if(this.#options.am_pm){
            let am_pm = time2[1] ?? this.getAmPm();
            this.#container.querySelector(".timepicker-ampm select").value = am_pm;
        }
    }
    
    #getInputTime(){
        let time = this.#placeholder.value.split(":");
        let time2 = (time[1] ?? " ").split(" ");
        let hour = parseInt(time[0]);
        let minutes = parseInt(time2[0]);
        
        return {
            hour: hour,
            minute: minutes,
            am_pm: time2[1]
        }
    }
    
    #getSelectors(){
        let time = this.#getInputTime();
        return `
            <table class="timepicker-selectors container-fluid ${this.#options.custom_classes.selectors}">
                <thead>
                    <tr>
                        <td>${this.#options.lang.hours}</td>
                        <td></td>
                        <td>${this.#options.lang.minutes}</td>
                        `+(this.#options.am_pm ? `<td></td>` : "")+`
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="timepicker-hours">
                            ${this.#generateSelect("hours", this.#hour_range.from, this.#hour_range.to, 1, time.hour)}
                        </td>
                        <td>
                            :
                        </td>
                        <td class="timepicker-minutes">
                            ${this.#generateSelect("minutes", 0, 59, 5, time.minute)}
                        </td>
                        `+(
                            this.#options.am_pm ? `
                                <td class="timepicker-ampm">
                                    <select id="ampm" class="form-select">
                                        <option `+(time.am_pm == "AM" ? "selected" : "")+`>AM</option>
                                        <option `+(time.am_pm == "PM" ? "selected" : "")+`>PM</option>
                                    </select>
                                </td>
                            ` : ""
                        )+`
                    </tr>
                </tbody>
            </table>
        `;
    }
    
    #generateSelect(id, min, max, step = 1, selected = 0){
        let select = `
            <select class="${id} form-select">
                <option value="">--</option>
        `;
        
        for(let i = min; i <= max; i += step){
            select += `<option value="${i}" ${i == selected ? "selected" : ""}>${i < 10 ? "0" + i : i}</option>`;
            
            if(selected % step != 0 && i < selected && selected < i + step){
                select += `<option value="${selected}" selected>${selected < 10 ? "0" + selected : selected}</option>`;
            }
        }
        
        select += '</select>';
        
        return select;
    }
}