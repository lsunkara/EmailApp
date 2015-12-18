describe('Email controller', function(){
    var controller;
    beforeEach(function(){
        bard.appModule('EmailApp');
        bard.inject('$controller','$rootScope');
        controller = $controller('EmailCtrl');
        $rootScope.$apply();
    });
    it('should initilize title', function(){
        expect(controller.title).toEqual('Loading...')
    });
});