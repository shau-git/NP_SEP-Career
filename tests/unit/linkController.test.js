// 1. MOCK: Completely mock the database connection and model dependencies 
// to prevent Sequelize initialization crashes during unit testing.
jest.mock("../../backend/db/connect", () => ({}))
jest.mock("../../backend/models/user", () => ({}))
jest.mock("../../backend/models/link", () => ({
    findOne: jest.fn(),
    update: jest.fn(),
}));

const linkController = require("../../backend/controllers/link_controllers")
const Link = require("../../backend/models/link")

describe('"linkController" unit test - User Profile Links', () => {

    // Shared mock data used across multiple test cases
    const mockPayload = { user_id: 1, name: 'SJ', email: 'ksj@gmail.com' }

    const mockNewLink = { 
        link_id: 1, 
        user_id: 4, 
        type: 'GitHub', 
        url: 'https://github.com/shau-git/NP_SEP-Career' 
    }

    beforeEach(() => {
        // Clear all mock call histories before each test
        jest.clearAllMocks()
    });

    afterEach(() => {
        // Automatically restore all spies and mocks after every test case
        jest.restoreAllMocks()
    });

    test("updateLink() should update link record and return success response", async () => {
        // STUB: Canned test data objects
        // Represents an existing record retrieved from the database during findOne checks
        const mockExistingLink = { 
            link_id: 1, 
            user_id: 1, 
            type: 'GitHub', 
            url: 'https://github.com/shau-git/juice-shop' 
        }

        // Arrange: Build mock request and response objects
        const req = { user: mockPayload, params: { link_id: 1 }, body: mockNewLink }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        // SPY & STUB: Spy on Link.findOne and provide a mock resolved value
        const findOneSpy = jest.spyOn(Link, 'findOne')
            .mockResolvedValueOnce(mockExistingLink)
            .mockResolvedValueOnce(mockNewLink);
        
        // Mock the update method so the controller completes its logic
        Link.update.mockResolvedValue([1])

        // Act: Run the controller function
        await linkController.updateLink(req, res)

        // Assert: Verify behavior and results
        expect(findOneSpy).toHaveBeenCalledTimes(2)
        expect(findOneSpy).toHaveBeenCalledWith({ where: { link_id: 1 } })
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({
            message: "Link record added successfully", 
            data: mockNewLink                           
        })
    });

    test("updateLink() should throw NotFoundError if the link record does not exist", async () => {
        // Arrange
        const req = { user: mockPayload, params: { link_id: 999 }, body: mockNewLink }
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
        const next = jest.fn()

        // Stub findOne to return null (simulating record not found)
        Link.findOne.mockResolvedValue(null)
        const findOneSpy = jest.spyOn(Link, 'findOne')

        // Act
        await linkController.updateLink(req, res, next)

        // Assert
        expect(next).toHaveBeenCalledTimes(1)
        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Link id 999 record not found!"
            })
        )
        expect(findOneSpy).toHaveBeenCalledTimes(1)
    });
    
    test("updateLink() should throw forbidden error if the user updates a link record that does not belong to them (verify by user_id)", async () => {
        // STUB: Canned test data objects
        // Represents an existing record retrieved from the database during findOne checks
        const mockExistingLink = { 
            link_id: 1, 
            user_id: 4, 
            type: 'GitHub', 
            url: 'https://github.com/shau-git/juice-shop' 
        }

        // Arrange
        const req = { user: mockPayload, params: { link_id: 1 }, body: mockNewLink }
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
        // Mock next function
        const next = jest.fn() // add this because the updateLink controller is in the asyncWrapper()

        // Stub findOne to return a link belonging to a different user_id
        Link.findOne.mockResolvedValue(mockExistingLink)
        const findOneSpy = jest.spyOn(Link, 'findOne')

        // Act: Run the controller with next
        await linkController.updateLink(req, res, next)
        // console.log(next.mock.calls)
        // Assert: Verify that the error was passed to next()
        expect(next).toHaveBeenCalledTimes(1)
        expect(next.mock.calls[0][0].message).toBe("This action is forbidden")
        expect(findOneSpy).toHaveBeenCalledTimes(1)
    });
});