/*!
 * Timepicker
 * https://github.com/andreazorzi/Timepicker
 *
 * Date: 2023-01-11
 */

import default_lang from "./locale/it.js";
window.default_lang = default_lang;

export default class Timepicker{
	#element = null;
	#container = null;
	#selectors = null;
	#options = {
		disabled: true,
		selected:{
			hour: -1,
			minute: -1
		},
		lang: default_lang
	}
	
	constructor(element_selector, options){
		let element = document.querySelector(element_selector);
		
		if(element == null){
			console.warn(`Element ${element_selector} not found`);
			return;
		}
		
		this.#element = element;
		this.#container = this.#element.closest(".timepicker");
		this.#options = { ...this.#options, ...options };
		
		this.#init();
	}
	
	#init(){
		// Configurations
		this.#element.readOnly = this.#options.disabled;
		
		// Add selectors to container
		this.#container.insertAdjacentHTML("beforeend", this.#getSelectors());
		this.#selectors = this.#container.querySelector(".timepicker-selectors");
		
		// Add listeners
		this.#element.addEventListener("click", () => {
			this.open();
		});
		
		document.addEventListener("click", this.#checkOutsideClick.bind(this), false);
		
		this.#container.querySelectorAll('select').forEach(item => {
			item.addEventListener('change', this.setHours.bind(this));
		})
		
		// Set initial values
		this.setHours();
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
	
	setHours(){
		let hour = this.getHour();
		let minute = this.getMinute();
		
		let time = hour == "" || minute == "" ? "" : `${hour < 10 ? "0" + hour : hour}:${minute < 10 ? "0" + minute : minute}`;
		
		this.#element.value = time;
	}
	
	element(){
		return this.#element;
	}
	
	#getSelectors(){
		return `
			<div class="timepicker-selectors container-fluid">
				<div class="timepicker-row">
					<div class="timepicker-col">${this.#options.lang.hours}</div>
					<div class="timepicker-col"></div>
					<div class="timepicker-col">${this.#options.lang.minutes}</div>
				</div>
				<div class="timepicker-row">
					<div class="timepicker-hours timepicker-col">
						${this.#generateSelect("hours", 0, 23, 1, this.#options.selected.hour)}
					</div>
					<div class="timepicker-col">
						:
					</div>
					<div class="timepicker-minutes timepicker-col">
						${this.#generateSelect("minutes", 0, 59, 5, this.#options.selected.minute)}
					</div>
				</div>
			</div>
		`;
	}
	
	#generateSelect(id, min, max, step = 1, selected = 0){
		let select = `
			<select id="${id}" class="form-select">
				<option value="">--</option>
		`;
		
		for(let i = min; i <= max; i += step){
			select += `<option value="${i}" ${i == selected ? "selected" : ""}>${i < 10 ? "0" + i : i}</option>`;
		}
		
		select += '<select>';
		
		return select;
	}
}