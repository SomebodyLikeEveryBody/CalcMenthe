//okay
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

    this.propoundNewQuestion = function () {
        this.questionWidget.displayNewQuestion();
        this.status = this.QUESTION_ASKED_STATUS;
        this.answerWidget.clear();
        this.answerWidget.focus();
        this.answerWidget.displayDefaultStyle();
    };

    this.setEvents = function () {
        let that = this;

        this.questionWidget.jqEl.click(function () {
            if (that.status === that.QUESTION_ASKED_STATUS) {
                that.status = that.QUESTION_ANSWERED_STATUS;
                that.questionWidget.jqEl.fadeOut(100, function () {
                    that.questionWidget.setContent(that.questionWidget.currentQuestion + ' = ' + that.getGoodAnswer());
                    that.questionWidget.jqEl.fadeIn(100, function () {
                        if (that.answerWidget.getInputVal() === that.getGoodAnswer()) {
                            setTimeout(function () {
                                that.propoundNewQuestion();
                            }, 100);
                        }
                    });
                });

                if (that.answerWidget.getInputVal() === that.getGoodAnswer()) {
                    that.answerWidget.displayGoodStyle();
                } else {
                    that.answerWidget.displayWrongStyle();
                }
                
            } else if (that.status === that.QUESTION_ANSWERED_STATUS) {
                that.propoundNewQuestion();
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

function QuestionGenerator() {

    this.rand = function (pMin, pMax, pInteger) {
        if(pInteger)
            return Math.floor(((Math.random() * (pMax-pMin+1)) + pMin));		
        else
            return ((Math.random() * (pMax-pMin)) + pMin);
    };
}

function QuestionWidget() {
    this.jqEl = $('#question');
    this.contentEl = this.jqEl.find('span');
    this.currentQuestion = '';
    this.minBoundary = 0;
    this.maxBoundary = 0;

    this.rand = function (pMin, pMax, pInteger) {
        if(pInteger)
            return Math.floor(((Math.random() * (pMax-pMin+1)) + pMin));		
        else
            return ((Math.random() * (pMax-pMin)) + pMin);
    };

    this.getParamInURL = function (pParam) {
        let vars = {};
      
        window.location.href
          .replace(location.hash, "")
          .replace(/[?&]+([^=&]+)=?([^&]*)?/gi, function(m, key, value) {
            vars[key] = value !== undefined ? value : "";
          });
      
        if (pParam) {
          return vars[pParam] ? vars[pParam] : 'nope';
        }
    };

    this.getBoundary = function (pParam, pDefaultValue) {
        let param = Number(this.getParamInURL(pParam));
    
        return ((Number.isNaN(param) || param < 0) ? pDefaultValue : param);
    };

    this.convertToLatex = function (pText) {
        return M(pText, true);
    };

    this.generateQuestion = function () {
        this.currentQuestion = this.rand(this.minBoundary, this.maxBoundary, true) + '^2';
        return this.currentQuestion;
    };

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
        this.minBoundary = this.getBoundary('min', 0);
        this.maxBoundary = this.getBoundary('max', 30);
        
        if (this.maxBoundary < this.minBoundary) {
            this.maxBoundary = this.minBoundary + this.maxBoundary
        }

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

function OptionPanel() {
    this.jqEl = $("#optionsPanel");
    this.closeOptionsPanelButton = $("#closeOptionsPanel")
    this.isVisible = false;

    this.show = function () {
        if(this.isVisible === false) {
            this.jqEl.fadeIn(200);
            this.isVisible = true;
        }
    }
    
    this.hide = function() {
        if(this.isVisible === true) {
            this.jqEl.fadeOut(200);
            this.isVisible = false;
        }
    }
 
    this.setEvents = function() {
        this.closeOptionsPanelButton.on('click', () => {
            this.hide();
            $('#answer').focus();
        });
    }

    this.init = function() {
        this.setEvents();
    }
}

$(function () {
    let questionWidget = new QuestionWidget();
    let answerWidget = new AnswerWidget();
    let optionPanel = new OptionPanel();
    let controller = new Controller(questionWidget, answerWidget);

    questionWidget.init();
    answerWidget.init();
    optionPanel.init();
    controller.init();

    $('#optionsButton').on('click', () => optionPanel.show());
    $('body').on('keydown', (e) => {
        if(e.which === 27) {
            optionPanel.hide();
        }
    })
});

