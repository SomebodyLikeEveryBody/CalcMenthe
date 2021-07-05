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
    this.question = '';
    this.status = this.UNDEFINED_STATUS;

    this.proposeQuestion = function () {
        this.question = rand(1, 50, true) + '^2';
        this.questionWidget.setContent(this.question + ' = ?');
        this.status = this.QUESTION_ASKED_STATUS;
    }

    this.setEvents = function () {
        let that = this;

        this.questionWidget.jqEl.click(function () {
            // if (that.status === QUESTION_ANSWERED_STATUS) {
                that.questionWidget.hide();
                that.proposeQuestion();
                that.questionWidget.show();
                that.answerWidget.clear();
                that.answerWidget.focus();
            // } else if (that.status === QUESTION_ASKED_STATUS) {

            // }
        });

        this.answerWidget.jqEl.keydown(function (e) {
            if (e.which === 13) {
                that.questionWidget.click();
            }
        });
    };

    this.init = function () {
        this.setEvents();
        this.proposeQuestion();
    };
}

function QuestionWidget() {
    this.jqEl = $('#question');
    this.contentEl = this.jqEl.find('span');

    this.convertToLatex = function (pText) {
        return M(pText, true);
    }

    this.click = () => this.jqEl.click();
    this.hide = () => this.contentEl.hide(500);
    this.show = () => this.contentEl.fadeIn(500);
    this.clearContent = () => this.contentEl.html('');
    this.setContent = function (ptextContent) {
        this.clearContent();
        this.contentEl.append(this.convertToLatex(ptextContent));
    };

    this.init = function () {

    };
}

function AnswerWidget() {
    this.jqEl = $('#answer');

    this.focus = () => this.jqEl.focus();
    this.clear = () => this.jqEl.val('');
    this.addclickEvent = this.jqEl.click;

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