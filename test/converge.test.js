const Converge = artifacts.require("./Converge.sol");
const truffleAssert = require('truffle-assertions');

contract("Converge", accounts => {

    let converge;
    const ownerAccount = accounts[0];
    const unauthorizedAccount = accounts[1];
    const defaultGroupName = "Default Name";
    const defaultGroupDescription = "Default Description";
    const defaultGroupLocation = "Default Location";
    const defaultMeetingTitle = "Default Title";
    const defaultMeetingDescription = "Default Description";
    const defaultMeetingLocation = "Default Location";
    const defaultMeetingDate = parseInt((new Date()).getTime() / 1000);

    beforeEach(async () => {
        converge = await Converge.new({ from: ownerAccount });
        await converge.addGroup(
            defaultGroupName, 
            defaultGroupDescription, 
            defaultGroupLocation, 
            {from: ownerAccount}
        );
        await converge.addMeeting(
            defaultGroupName, 
            defaultMeetingTitle, 
            defaultMeetingDescription, 
            defaultMeetingLocation, 
            defaultMeetingDate, 
            {from: ownerAccount}
        );
    });

    it("should add new group", async () => {
        const name = "Test Name";
        const description = "Test Description";
        const location = "Test Location";
    
        await converge.addGroup(name, description, location, {from: ownerAccount});
    
        const storedData = await converge.getGroup(name, {from: ownerAccount});
    
        assert.equal(storedData[0], name, "Incorrect name");
        assert.equal(storedData[1], description, "Incorrect description");
        assert.equal(storedData[2], location, "Incorrect location");
    });

    it("should revert add duplicate group", async () => {
        const description = "Duplicate Description";
        const location = "Duplicate Location";
    
        await truffleAssert.reverts(
            converge.addGroup(
                defaultGroupName, 
                description, 
                location, 
                {from: ownerAccount}
            ), "Group exists"
        );
    });

    it("should revert add group from unauthorized account", async () => {
        const name = "Test Name";
        const description = "Test Description";
        const location = "Test Location";
    
        await truffleAssert.reverts(
            converge.addGroup(
                name, 
                description, 
                location, 
                {from: unauthorizedAccount}
            ), "Unauthorized"
        );
    });

    it("should update existing valid group", async () => {
        const updatedDescription = "Update Description";
        const updatedLocation = "Update Location";

        await converge.updateGroup(
            defaultGroupName, 
            updatedDescription, 
            updatedLocation, 
            {from: ownerAccount}
        );

        const storedData = await converge.getGroup(defaultGroupName, {from: ownerAccount});
    
        assert.equal(storedData[0], defaultGroupName, "Incorrect name");
        assert.equal(storedData[1], updatedDescription, "Incorrect description");
        assert.equal(storedData[2], updatedLocation, "Incorrect location");
    });

    it("should revert update non-existing group", async () => {
        const updatedName = "Fake Name";
        const updatedDescription = "Update Description";
        const updatedLocation = "Update Location";

        await truffleAssert.reverts(
            converge.updateGroup(
                updatedName, 
                updatedDescription, 
                updatedLocation, 
                {from: ownerAccount}
            ), "Invalid group"
        );

    });

    it("should revert update group from unauthorized account", async () => {
        const updatedDescription = "Update Description";
        const updatedLocation = "Update Location";

        await truffleAssert.reverts(
            converge.updateGroup(
                defaultGroupName, 
                updatedDescription, 
                updatedLocation, 
                {from: unauthorizedAccount}
            ), "Unauthorized"
        );
    });

    it("should delete valid group", async () => {
        const name = "Test Name";
        const description = "Test Description";
        const location = "Test Location";
    
        await converge.addGroup(name, description, location, {from: ownerAccount});
    
        const storedData = await converge.getGroup(name, {from: ownerAccount});
    
        assert.equal(storedData[0], name, "Incorrect name");

        await converge.deleteGroup(name, { from: ownerAccount });

        await truffleAssert.reverts(
            converge.getGroup(name, {from: ownerAccount}), "Invalid group"
        );
    });

    it("should revert delete group with meetings", async () => {
        await truffleAssert.reverts(
            converge.deleteGroup(defaultGroupName, { from: ownerAccount }), "Can not contain meetings"
        );
    });

    it("should revert delete non-existing group", async () => {
        const fakeName = "Fake Name";
        await truffleAssert.reverts(
            converge.deleteGroup(fakeName, { from: ownerAccount }), "Invalid group"
        );
    });

    it("should revert delete group from unauthorized account", async () => {
        await truffleAssert.reverts(
            converge.deleteGroup(defaultGroupName, { from: unauthorizedAccount }), "Unauthorized"
        );
    });

    it("should add new meeting", async () => {
        const meetingId = await converge.meetingCount();
        const expectedTitle = "Test Title";
        const expectedDescription = "Test Description";
        const expectedLocation = "Test Location";
        const expectedDate = parseInt((new Date()).getTime() / 1000);

        await converge.addMeeting(
            defaultGroupName, 
            expectedTitle, 
            expectedDescription, 
            expectedLocation, 
            expectedDate, 
            {from: ownerAccount}
        );

        const storedData = await converge.getMeeting(meetingId, {from: ownerAccount});
    
        assert.equal(storedData[0].toString(), meetingId.toString(), "Incorrect id");
        assert.equal(storedData[1], expectedTitle, "Incorrect title");
        assert.equal(storedData[2], expectedDescription, "Incorrect description");
        assert.equal(storedData[3], expectedLocation, "Incorrect location");
        assert.equal(storedData[4], expectedDate, "Incorrect date");
    });

    it("should revert add meeting from unauthorized account", async () => {
        const expectedTitle = "Test Title";
        const expectedDescription = "Test Description";
        const expectedLocation = "Test Location";
        const expectedDate = parseInt((new Date()).getTime() / 1000);

        await truffleAssert.reverts(
            converge.addMeeting(
                defaultGroupName, 
                expectedTitle, 
                expectedDescription, 
                expectedLocation, 
                expectedDate, 
                {from: unauthorizedAccount}
            ), "Unauthorized"
        );
    });

    it("should update existing valid meeting", async () => {
        const meetingId = await converge.getGroupMeetingAtIndex(defaultGroupName, 0);
        const updatedTitle = "Update Title";
        const updatedDescription = "Update Description";
        const updatedLocation = "Update Location";
        const updatedDate = parseInt((new Date()).getTime() / 1000);

        await converge.updateMeeting(
            meetingId, 
            updatedTitle,
            updatedDescription, 
            updatedLocation, 
            updatedDate,
            {from: ownerAccount}
        );

        const storedData = await converge.getMeeting(meetingId, {from: ownerAccount});
    
        assert.equal(storedData[0].toString(), meetingId.toString(), "Incorrect id");
        assert.equal(storedData[1], updatedTitle, "Incorrect title");
        assert.equal(storedData[2], updatedDescription, "Incorrect description");
        assert.equal(storedData[3], updatedLocation, "Incorrect location");
        assert.equal(storedData[4].toString(), updatedDate.toString(), "Incorrect date");
    });

    it("should revert update non-existing meeting", async () => {
        const meetingId = 99;
        const updatedTitle = "Update Title";
        const updatedDescription = "Update Description";
        const updatedLocation = "Update Location";
        const updatedDate = parseInt((new Date()).getTime() / 1000);


        await truffleAssert.reverts(
            converge.updateMeeting(
                meetingId, 
                updatedTitle,
                updatedDescription, 
                updatedLocation, 
                updatedDate,
                {from: ownerAccount}
            ), "Invalid meeting"
        );
    });

    it("should revert update meeting from unauthorized account", async () => {
        const meetingId = await converge.getGroupMeetingAtIndex(defaultGroupName, 0);
        const updatedTitle = "Update Title";
        const updatedDescription = "Update Description";
        const updatedLocation = "Update Location";
        const updatedDate = parseInt((new Date()).getTime() / 1000);

        await truffleAssert.reverts(
            converge.updateMeeting(
                meetingId, 
                updatedTitle,
                updatedDescription, 
                updatedLocation, 
                updatedDate,
                {from: unauthorizedAccount}
            ), "Unauthorized"
        );
    });

    it("should delete existing valid meeting", async () => {
        const meetingId = await converge.getGroupMeetingAtIndex(defaultGroupName, 0);
        const storedMeeting = await converge.getMeeting(meetingId, {from: ownerAccount});
    
        assert.equal(storedMeeting[0].toString(), meetingId.toString(), "Incorrect id");
        assert.equal(storedMeeting[1], defaultMeetingTitle, "Incorrect Title");

        await converge.deleteMeeting(meetingId, { from: ownerAccount });

        await truffleAssert.reverts(
            converge.getMeeting(meetingId, {from: ownerAccount}), "Invalid meeting"
        );
    });

    it("should revert delete non-existing meeting", async () => {
        const fakeMeeingId = 99;
        await truffleAssert.reverts(
            converge.deleteMeeting(fakeMeeingId, { from: ownerAccount }), "Invalid meeting"
        );
    });

    it("should revert delete meeting from unauthorized account", async () => {
        const meetingId = await converge.getGroupMeetingAtIndex(defaultGroupName, 0);
        await truffleAssert.reverts(
            converge.deleteMeeting(meetingId, { from: unauthorizedAccount }), "Unauthorized"
        );
    });
});
