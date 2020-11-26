// SPDX-License-Identifier: MIT
pragma solidity 0.7.5;
pragma experimental ABIEncoderV2;

contract Converge {

    address private owner;

    mapping (string => Group) private groups;
    string[] private groupList;

    uint private meetingCount;
    mapping (uint => Meeting) private meetings;

    struct Group {
        string name;
        string description;
        string location;
        uint listIndex;
        bool isValid;
    }

    struct Meeting {
        uint id;
        string title;
        string description;
        string location;
        uint date;
    }

    event LogNewGroup(address actor, string name);
    event LogUpdateGroup(address actor, string name);
    event LogDeleteGroup(address actor, string name);
    event LogNewMeeting(address actor, uint id, string title);
    event LogUpdateMeeting(address actor, uint id, string title);

    modifier onlyOwner {
        require(msg.sender == owner, "Unauthorized");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function addGroup(string memory _name, string memory _description, string memory _location) public onlyOwner {
        require(!groups[_name].isValid, "Group exists");
        emit LogNewGroup(msg.sender, _name);
        groups[_name] = Group({name: _name, description: _description, location: _location, listIndex: groupList.length, isValid: true});
        groupList.push(_name);
    }

    function getGroup(string memory _name) external view returns(string memory, string memory, string memory) {
        require(groups[_name].isValid, "Invalid group");
        return (groups[_name].name, groups[_name].description, groups[_name].location);
    }

    function updateGroup(string memory _name, string memory _description, string memory _location) public onlyOwner {
        require(groups[_name].isValid, "Invalid group");
        emit LogUpdateGroup(msg.sender, _name);
        Group storage group = groups[_name];
        group.description = _description;
        group.location = _location;
    }

    function deleteGroup(string memory _name) public onlyOwner {
        require(groups[_name].isValid, "Invalid group");
        emit LogDeleteGroup(msg.sender, _name);
        uint indexToDelete = groups[_name].listIndex;
        string storage keyToMove = groupList[groupList.length - 1];
        groupList[indexToDelete] = keyToMove;
        groups[keyToMove].listIndex = indexToDelete;
        groupList.pop();
        delete groups[_name];
    }

    function getGroups() external view returns (Group[] memory){
        Group[] memory groupArray = new Group[](groupList.length);
        for (uint i = 0; i < groupList.length; i++) {
            groupArray[i] = groups[groupList[i]];
        }
        return groupArray;
    }

    function addMeeting(string memory _title, string memory _description, string memory _location, uint _date) public onlyOwner {
        emit LogNewMeeting(msg.sender, meetingCount, _title);
        meetings[meetingCount] = Meeting({id: meetingCount, title: _title, description: _description, location: _location, date: _date});
        meetingCount += 1;
    }

    function getMeeting(uint _id) external view returns(uint, string memory, string memory, string memory, uint) {
        return (meetings[_id].id, meetings[_id].title, meetings[_id].description, meetings[_id].location, meetings[_id].date);
    }

    function updateMeeting(uint _id, string memory _title, string memory _description, string memory _location, uint _date) public onlyOwner {
        emit LogUpdateMeeting(msg.sender, _id, _title);
        Meeting storage meeting = meetings[_id];
        meeting.title = _title;
        meeting.description = _description;
        meeting.location = _location;
        meeting.date = _date;
    }

    function deleteMeeting(uint _id) public onlyOwner {
        delete meetings[_id];
    }

    function getMeetings() external view returns (Meeting[] memory){
        Meeting[] memory meetingArray = new Meeting[](meetingCount);
        for (uint i = 0; i < meetingCount; i++) {
            meetingArray[i] = meetings[i];
        }
        return meetingArray;
    }
}