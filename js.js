function Controller(pQuestionWidget, pAnswerWidget) {
    this.questionWidget = pQuestionWidget;
    this.answerWidget = pAnswerWidget;

    this.setEvents = function () {
        let that = this;

        this.questionWidget.jqEl.click(function () {
            that.answerWidget.clear();
            that.answerWidget.focus();
        });

        this.answerWidget.jqEl.keydown(function (e) {
            if (e.which === 13) {
                that.questionWidget.click();
            }
        });
    }

    this.init = function () {
        this.setEvents();
    }
}

function QuestionWidget() {
    this.jqEl = $('#question');

    this.click = () => this.jqEl.click();

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