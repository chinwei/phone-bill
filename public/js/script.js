// Parse.initialize("fWhknT3EUSYS3uuT0txaY6BHLAUJLgZ60jBQAEZF", "5NkjEkUq55gJ3512CFwAsKuqlY5iU1Vpbj3pdzWP");\


var App = {
	init: function() {
		FastClick.attach(document.body);
		$('#calendar').scrollLeft($(window).width());
		$('#calendar .day-cell:last').addClass('active');
	},
	disableScroll: function() {
		$('body').on('touchmove.scroll', function(e) {
		    e.preventDefault();
		});
	},
	enableScroll: function() {
		$('body').off('.scroll');
	},
	notifyBP: function() {
		$('#biostats > .badge').removeClass('hide');
	},
	removeNotifyBP: function() {
		$('#biostats > .badge').addClass('hide');
	},
	cardSelected: 'none',
};



var checkBoxComponent = {
	init: function() {
		checkBoxComponent.handleEvents();
		checkBoxComponent.toggleCheckboxValue();
	},
	toggleCheckboxValue: function() {
		$('#feedback ul li').click(function(){
			var $this = $(this);
			if ($this.find('i').hasClass('fa-square')) {
					$this.find('i').addClass('fa-check-square').removeClass('fa-square');
				} else if ($this.find('i').hasClass('fa-check-square')) {
			$this.find('i').addClass('fa-square').removeClass('fa-check-square');
			}
		})
	},
	getCheckboxValue: function() {
		var feedbackStr = '';
		$('#feedback ul li').each(function(){
			var $this = $(this);
			if ($this.find('i').hasClass('fa-check-square')) {
				feedbackStr +=  $this.index().toString() + ', ';
			}
		})
		// feedbackStr += "dismissedCard " + $('#feedback').attr('data-selected');
		feedbackStr += "dismissedCard " + App.cardSelected + ' Other: ' + $('#feedback input').val();
		console.log(feedbackStr);
		return feedbackStr;
	},
	handleEvents: function() {
		// Event listeners
		$('#feedback-submit-btn').click(function(){
			checkBoxComponent.getCheckboxValue();
			cardComponent.removeCard();
		});
		$('#feedback-submit-btn, #feedback .close-btn').click(function(){
			$('#feedback').addClass('hide');
			// $('#feedback').attr('data-selected', 'none');
			App.cardSelected = 'none';
			// resumes scroll behavior
			App.enableScroll();
		});
	}
}


var cardComponent = {
	init: function() {
		// check if user has logged in. If not, display screen
		cardComponent.handleEvents();
	},
	handleEvents: function() {
		$('.dismiss').click(function(){
			var $this = $(this);
			var dismissedCard = $this.parent().parent().index();
			
			// $('#feedback').attr('data-selected', dismissedCard);
			App.cardSelected = dismissedCard;
			$('#feedback ul li i').removeClass('fa-square, fa-check-square').addClass('fa-square');
			$('#feedback').removeClass('hide');
			// disables scroll when overlay is open
			App.disableScroll();
			
		})
		// complete task
		$('.card.recs .action').click(function(){
			var $this = $(this);
			var $parent = $this.parent().parent();
			var rec = $parent.find('.content-text h4').text();
			var type = function() {
				if ($parent.hasClass('fitness')) {
					return 'fitness';
				} else if ($parent.hasClass('stress')) {
					return 'stress';
				} else if ($parent.hasClass('food')) {
					return 'food';
				}
			}
			activityComponent.newActivity(type(), rec.toString());
			activityComponent.addActivityItem();

			// console.log(type);
			App.cardSelected = $parent.index();
			$parent.addClass('done');
			$parent.find('.dismiss').off();
			$parent.find('.reminder').off();
			cardComponent.removeCard();
			// update parse database here...
		})

		$('.card.intro').click(function(){
			$('#bp').removeClass('hide');
		})

		$('.reminder').click(function(){
			var $this = $(this);
			var selectedCard = $this.parent().parent().index();
			$('#time').removeClass('hide');
			// $('#time').attr('data-selected', selectedCard);
			App.cardSelected = selectedCard;
			// App.disableScroll();
		})
	},
	removeCard: function() {
		// var targetCard = $('#feedback').attr('data-selected');
		var targetCard = App.cardSelected;
		console.log(App.cardSelected);
		// $('section.container > .recs').eq(targetCard).addClass('gone');
		$('#'+targetCard).addClass('gone');
	}
}

/* On submit, sends device UUID to parse. 
On refresh, checks to see if any UUID on parse 
matches that on device. If there is a match, 
means device is registered.
*/
var loginComponent = {
	init: function(){
		//if device is not registered, do this
		$('#login').removeClass('hide');
		App.disableScroll();
		loginComponent.handleEvents();
	},
	handleEvents: function() {
		// Event listeners
		$('#login-submit-btn').click(function(){
			//Send device UUID to parse
			var name = $('#login-name').val();
		});
		$('#login-submit-btn, #login .close-btn').click(function(){
			$('#login').addClass('hide');
			// resumes scroll behavior
			App.enableScroll();
		});
	}

}

var pickerComponent = {
	init: function(){
		pickerComponent.centerOnActiveItem();
		pickerComponent.handleEvents();

		
	},
	centerOnActiveItem: function() {
		
		var stepHeight = 48;
		var selectedItem = $('ul.mask li.active');

		selectedItem.each(function(){
			var $this = $(this);
			var $pos = ($this.index()-1)*stepHeight;	
			var scrollContainer = $this.parent();
			scrollContainer.scrollTop($pos);
		})
		
		
	},
	handleEvents: function() {
		$('.picker ul.mask').on('scroll', function(){
			var debugText = $(this).closest('.content').children('h4')
			var selectedItem = Math.round($(this).scrollTop()/48);
			// debugText.text($(this).scrollTop());
			$(this).children('li').removeClass('active')
			$(this).children('li').eq(selectedItem+1).addClass('active')
			// console.log();
		})

		$('ul.mask li').on('click', function(){
			$this = $(this);
			$this.parent().find('li').removeClass('active');
			$this.addClass('active');
			var $item = $this.parent().find('li.active').index();
			var $pos = ($item - 1)*48;
			$this.parent().scrollTop($pos);
		})


		$('.picker-cell i.btn').click(function(){
			var $this = $(this);
			var selectedItem = $this.parent().children('ul.mask').find('li.active');
			var stepHeight = 48;
			var scrollContainer = $this.parent().children('ul.mask');
			
			var newPos;

			$this.parent().children('ul.mask').find('li').removeClass('active');
			if ($this.hasClass('down-btn')) {
				selectedItem.next().addClass('active');
			} else if ($this.hasClass('up-btn')) {

				selectedItem.prev().addClass('active');
			}
			selectedItem = $this.parent().children('ul.mask').find('li.active');
			var currentPos = (selectedItem.index()-1)*stepHeight;
			// console.log(currentPos);
			scrollContainer.scrollTop(currentPos);
			
			
		})


	}
}

var timePickerComponent = {
	init: function(){
		timePickerComponent.handleEvents();
		pickerComponent.centerOnActiveItem();

	},
	
	handleEvents: function() {

		
	

		$('#time-submit-btn').click(function(){
			//Send device UUID to parse
			var hour = $('#hour-container ul li.active').text();
			var minute = $('#minute-container ul li.active').text();
			var ampm = $('#ampm-container ul li.active').text();
			// var cardSelected = parseInt($('#time').attr('data-selected')) + 1;
			var cardSelected = parseInt(App.cardSelected) + 1;
			if (hour != '' && hour != '' && ampm != '') {
				// console.log(hour+'-'+minute+'-'+ampm);	
				var time = hour+'-'+minute+'-'+ampm;
				var reminderText = 'REMINDER SET FOR: '+hour+':'+minute+' '+ampm;
				$('#time').addClass('hide');
				$('#time').attr('data-input', time);		
				$('.recs:nth-child('+cardSelected+')').find('.action-bar .reminder').text(reminderText)
				console.log(cardSelected);

			}
			
		});

		

		$('#time .close-btn').click(function(){
			$('#time').addClass('hide');

			$('#time').attr('data-selected', 'none');
			// resumes scroll behavior
			App.enableScroll();
		});
	}
}

var BPComponent = {
	init: function(){
		BPComponent.handleEvents();
	},
	handleEvents: function() {

		$('#bp ul li').on('click', function(){
			$this = $(this);
			$this.parent().find('li').removeClass('active');
			$this.addClass('active');
			var $item = $this.parent().find('li.active').index();
			var $pos = ($item - 1)*48;
			$this.parent().scrollTop($pos);
			// console.log($('#hour-container ul li.active').index());
			// var hourItem = $this
		})

		$('#bp-submit-btn').click(function(){
			//Send device UUID to parse
			var systolic = $('#systolic-container ul li.active').text();
			var diastolic = $('#diastolic-container ul li.active').text();
		
			
			if (systolic != '' && diastolic != '') {
				var bp = systolic + '-' + diastolic;
				// var bpText = 'REMINDER SET FOR: '+hour+':'+minute+' '+ampm;
				$('#bp').addClass('hide');
				$('#bp').attr('data-input', bp);		
				// console.log(cardSelected);
				App.removeNotifyBP();

			}
			
		});

		$('#bp .close-btn').click(function(){
			$('#bp').addClass('hide');

			$('#bp').attr('data-selected', 'none');
			// resumes scroll behavior
			// App.enableScroll();
		});

		$('#biostats').click(function(){
			$('#bp').removeClass('hide');
		})
		

		
	}
}

var instructionComponent = {
	init: function() {
		// instructionComponent.resizeContainers();
		instructionComponent.handleEvents();
	},
	resizeContainers: function() {
		var numPages = $('#instructions .mask > .page').length;
		var containerWidth = numPages*100;
		var pageWidth = 100/numPages;
		console.log(numPages);
		console.log(pageWidth);
		$('#instructions .mask > .page').css('width',pageWidth+'%')
		$('#instructions .mask').width(containerWidth+'%');
	},
	handleEvents: function(){
		$('.card.recs .primary .content').click(function(){
			var $this = $(this);
			var dest = $this.parent().parent().data('info');
			$('#instructions').removeClass('hide');
			instructionComponent.loadContent(dest);
			// console.log(dest);
			// App.disableScroll();
		})
		// $('#instructions .back-btn').on('click', function(){
		// 	$('#instructions').addClass('hide');	
		// })

		$( document ).on( "click", '#instructions .back-btn', function() {
			$('#instructions').addClass('hide');
			$('#instructions .content-container').addClass('hide');

		});
		
	},
	loadContent: function(target){
		
	
		
		$('#instructions .content-container').load(target, function(response, status, XHR){
			if (status = 'success') {
				instructionComponent.resizeContainers();
				$('#instructions .content-container').removeClass('hide');
				$('#instructions > .preloader').addClass('hide');
			}
			// console.log(status);
			// console.log(response);

		});
	}

}

var activityComponent = {
	init: function(){
		activityComponent.handleEvents();
	},
	newActivity: function(type, rec, timestamp) {
		activityComponent.newActivityContent.type = type.toString();
		activityComponent.newActivityContent.rec = rec.toString();
		// activityComponent.newActivityContent.timestamp = timestamp.toString();
	},
	newActivityContent: {
		type: "stress",
	  	rec: "go run more!",
	  	doclikes: ''
	},
	addActivityItem: function() {
		  var activityTemplate = $('#activity-item').html();
		  Mustache.parse(activityTemplate);   // optional, speeds up future uses
		  var rendered = Mustache.render(activityTemplate, activityComponent.newActivityContent);
		  $('ul.activity').prepend(rendered);
	},
	handleEvents: function() {
		$('.month-container > .month-header').click(function(){
			$('.month-container > ul.activity').slideToggle(700)
		})
	}
}







activityComponent.init();
instructionComponent.init();
pickerComponent.init();
BPComponent.init();
timePickerComponent.init();
checkBoxComponent.init();
cardComponent.init();
// loginComponent.init();








App.init();

// ToggleCheckboxValue();

