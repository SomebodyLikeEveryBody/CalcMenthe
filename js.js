function rand(pMin, pMax, pInteger) {
	if(pInteger)
		return Math.floor(((Math.random() * (pMax-pMin+1)) + pMin));		
	else
    		return ((Math.random() * (pMax-pMin)) + pMin);
}

function Controller(pQuestionWidget, pAnswerWidget) {
    this.QUESTION_ASKED_STATUS = 0;
    this.QUESTION_ANSWERED_STATUS = 1;
    this.UNDEFINED_STATUS = -1;

    this.questionWidget = pQuestionWidget;
    this.answerWidget = pAnswerWidget;
    this.status = this.QUESTION_ASKED_STATUS;

    this.getGoodAnswer = function () {
        let number = Number(this.questionWidget.currentQuestion.split('^')[0]);
        return (number * number);
    };

    this.setEvents = function () {
        let that = this;

        this.questionWidget.jqEl.click(function () {
            if (that.status === that.QUESTION_ASKED_STATUS) {
                that.status = that.QUESTION_ANSWERED_STATUS;
                that.questionWidget.jqEl.fadeOut(100, function () {
                    that.questionWidget.setContent(that.questionWidget.currentQuestion + ' = ' + that.getGoodAnswer());
                    that.questionWidget.jqEl.fadeIn(100);
                });
                if (that.answerWidget.getInputVal() === that.getGoodAnswer()) {
                    that.answerWidget.displayGoodStyle();
                } else {
                    that.answerWidget.displayWrongStyle();
                }
                
            } else if (that.status === that.QUESTION_ANSWERED_STATUS) {
                that.questionWidget.displayNewQuestion();
                that.status = that.QUESTION_ASKED_STATUS;
                that.answerWidget.clear();
                that.answerWidget.focus();
                that.answerWidget.displayDefaultStyle();
            }
        });

        this.answerWidget.jqEl.keydown(function (e) {
            if (e.which === 13) {
                that.questionWidget.click();
            }
        });
    };

    this.init = function () {
        this.setEvents();
    };
}

function QuestionWidget() {
    this.jqEl = $('#question');
    this.contentEl = this.jqEl.find('span');
    this.currentQuestion = '';

    this.convertToLatex = function (pText) {
        return M(pText, true);
    }

    this.generateQuestion = function () {
        this.currentQuestion = rand(1, 20, true) + '^2';
        return this.currentQuestion;
    }

    this.displayNewQuestion = function () {
        let that = this;
        this.hide(function () {
            that.setContent(that.generateQuestion() + ' = ? ');
            that.show();
        });
    };

    this.click = () => this.jqEl.click();
    this.hide = (pCallback) => this.contentEl.hide(300, pCallback);
    this.show = () => this.contentEl.fadeIn(200);
    this.clearContent = () => this.contentEl.html('');
    this.setContent = function (ptextContent) {
        this.clearContent();
        this.contentEl.append(this.convertToLatex(ptextContent));
    };

    this.init = function () {
        this.setContent(this.generateQuestion() + ' = ? ');
    };
}

function AnswerWidget() {
    this.jqEl = $('#answer');

    this.focus = () => this.jqEl.focus();
    this.clear = () => this.jqEl.val('');
    this.addClickEvent = this.jqEl.click;

    this.getInputVal = () => Number(this.jqEl.val());
    this.displayGoodStyle = function () {
        this.jqEl.css({'color': 'darkgrey', 'text-shadow': 'green 10px 0 20px'});
    };

    this.displayWrongStyle = function () {
        this.jqEl.css({'color': 'black', 'text-shadow': 'red 10px 0 20px'});
    };

    this.displayDefaultStyle = function () {
        this.jqEl.css({'color': 'black', 'text-shadow': 'none'});
    };

    this.init = function () {
        this.focus();
    }
}

$(function () {
    let questionWidget = new QuestionWidget();
    let answerWidget = new AnswerWidget();
    let controller = new Controller(questionWidget, answerWidget);

    questionWidget.init();
    answerWidget.init();
    controller.init();
});