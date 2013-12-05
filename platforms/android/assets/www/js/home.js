BAsket.Accordion = function (params) {
    return {
        viewRendered: function () {
            $("#accordion").accordion({
                active: false,
                collapsible: true
            });
        }
      
    };
};