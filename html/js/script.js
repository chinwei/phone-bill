var App = {
	init: function(){
		paymentComponent.init();
		tocComponent.init();
	}
}



var paymentComponent = {
	init: function() {
		paymentComponent.handleEvent();
	},
	handleEvent: function() {
		$('#make-payment-btn').click(paymentComponent.showPaymentComponent);
		$('#make-payment-btn').click(paymentComponent.disableButton);
		$('#cancel-payment-btn').click(paymentComponent.hidePaymentComponent);
		$('#cancel-payment-btn').click(paymentComponent.enableButton);
	},
	showPaymentComponent: function(){
		$('#pay-now').removeClass('hide');
	},
	hidePaymentComponent: function(){
		$('#pay-now').addClass('hide');
	},
	disableButton: function(){
		$('#make-payment-btn').addClass('disabled');
	},
	enableButton: function(){
		$('#make-payment-btn').removeClass('disabled');
	}
}

var tocComponent = {
	init: function() {
		$('#toc').toc({
			'highlightOffset': 0,
			'highlightOnScroll': false
		});
	}
}


App.init();



