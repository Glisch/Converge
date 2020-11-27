// SPDX-License-Identifier: MIT
pragma solidity 0.7.5;
pragma experimental ABIEncoderV2;

contract Converge {

    address private owner;

    string[] private groupList;
    mapping (string => Group) private groups;
    uint public meetingCount;
    uint[] private meetingList;
    mapping (uint => Meeting) private meetings;

    struct Meeting {
        uint id;
        string title;
        string description;
        string location;
        uint date;
        string groupKey;
        uint meetingListPointer;
        bool isValid;
    }

    struct Group {
        string name;
        string description;
        string location;
        uint[] meetingKeys;
        mapping (uint => uint) meetingKeyPointers;
        uint groupListPointer;
        bool isValid;
    }

    event LogNewGroup(address actor, string name);
    event LogUpdateGroup(address actor, string name);
    event LogDeleteGroup(address actor, string name);
    event LogNewMeeting(address actor, string group, uint id);
    event LogUpdateMeeting(address actor, string group, uint id);
    event LogDeleteMeeting(address actor, string group, uint id);

    modifier onlyOwner {
        require(msg.sender == owner, "Unauthorized");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function getGroupMeetingCount(string memory _groupName) public view returns(uint) {
        require(groups[_groupName].isValid, "Invalid group");
        return groups[_groupName].meetingKeys.length;
    }

    function getGroupMeetingAtIndex(string memory _groupName, uint index) 
        public 
        view 
        returns(uint) 
    {
        require(groups[_groupName].isValid, "Invalid group");
        return groups[_groupName].meetingKeys[index];
    }

    function addGroup(string memory _groupName, string memory _description, string memory _location) 
        public 
        onlyOwner 
    {
        require(!groups[_groupName].isValid, "Group exists");
        emit LogNewGroup(msg.sender, _groupName);
        Group storage group = groups[_groupName];
        group.name = _groupName;
        group.description = _description;
        group.location = _location;
        group.groupListPointer = groupList.length;
        group.isValid = true;
        groupList.push(_groupName);
    }

    function getGroup(string memory _groupName) 
        external 
        view 
        returns(string memory, string memory, string memory) 
    {
        require(groups[_groupName].isValid, "Invalid group");
        return (
            groups[_groupName].name, 
            groups[_groupName].description, 
            groups[_groupName].location
        );
    }

    function updateGroup(
        string memory _groupName, 
        string memory _description, 
        string memory _location
    ) 
        public 
        onlyOwner 
    {
        require(groups[_groupName].isValid, "Invalid group");
        emit LogUpdateGroup(msg.sender, _groupName);
        Group storage group = groups[_groupName];
        group.description = _description;
        group.location = _location;
    }

    //TODO can only delete group if no meeting refers to it 
    // https://medium.com/robhitchens/enforcing-referential-integrity-in-ethereum-smart-contracts-a9ab1427ff42
    // function deleteGroup(string memory _name) public onlyOwner {
    //     require(groups[_name].isValid, "Invalid group");
    //     emit LogDeleteGroup(msg.sender, _name);
    //     uint indexToDelete = groups[_name].groupListPointer;
    //     string storage keyToMove = groupList[groupList.length - 1];
    //     groupList[indexToDelete] = keyToMove;
    //     groups[keyToMove].groupListPointer = indexToDelete;
    //     groupList.pop();
    //     delete groups[_name];
    // }

    // function getGroups() external view returns (Group[] memory){
    //     Group[] memory groupArray = new Group[](groupList.length);
    //     for (uint i = 0; i < groupList.length; i++) {
    //         groupArray[i] = groups[groupList[i]];
    //     }
    //     return groupArray;
    // }

    function addMeeting(
        string memory _groupName, 
        string memory _title, 
        string memory _description, 
        string memory _location, 
        uint _date
    ) 
        public 
        onlyOwner 
    {
        require(groups[_groupName].isValid, "Invalid group");
        Group storage group = groups[_groupName];
        uint meetingId = meetingCount;
        meetingCount++;
        emit LogNewMeeting(msg.sender, _groupName, meetingId);
        meetings[meetingId] = Meeting({
            id: meetingId, 
            title: _title, 
            description: _description, 
            location: _location, 
            date: _date, 
            groupKey: _groupName, 
            meetingListPointer: meetingList.length, 
            isValid: true
        });
        meetingList.push(meetingId);
        group.meetingKeyPointers[meetingId] = group.meetingKeys.length;
        group.meetingKeys.push(meetingId);
    }

    function getMeeting(uint _meetingId) 
        external 
        view 
        returns(uint, string memory, string memory, string memory, uint) 
    {
        require(meetings[_meetingId].isValid, "Invalid meeting");
        Meeting storage meeting = meetings[_meetingId];
        return (meeting.id, meeting.title, meeting.description, meeting.location, meeting.date);
    }

    function updateMeeting(
        uint _meetingId, 
        string memory _title, 
        string memory _description, 
        string memory _location, 
        uint _date
    ) 
        public 
        onlyOwner 
    {
        require(meetings[_meetingId].isValid, "Invalid meeting");
        Meeting storage meeting = meetings[_meetingId];
        emit LogUpdateMeeting(msg.sender, meeting.groupKey, _meetingId);
        meeting.title = _title;
        meeting.description = _description;
        meeting.location = _location;
        meeting.date = _date;
    }

//TODO
    // function deleteMeeting(string memory _name) public onlyOwner {
    //     require(groups[_name].isValid, "Invalid group");
    //     emit LogDeleteGroup(msg.sender, _name);
    //     uint indexToDelete = groups[_name].groupListPointer;
    //     string storage keyToMove = groupList[groupList.length - 1];
    //     groupList[indexToDelete] = keyToMove;
    //     groups[keyToMove].groupListPointer = indexToDelete;
    //     groupList.pop();
    //     delete groups[_name];
    // }

//TODO
    // function getMeetings() external view returns (Group[] memory){
    //     Group[] memory groupArray = new Group[](groupList.length);
    //     for (uint i = 0; i < groupList.length; i++) {
    //         groupArray[i] = groups[groupList[i]];
    //     }
    //     return groupArray;
    // }
}