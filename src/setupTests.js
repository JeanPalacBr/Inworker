// https://create-react-app.dev/docs/running-tests/#initializing-test-environment
global.fetch = jest.fn(() => ({ json: jest.fn(() => ({})) }))

//** Simulacion de modulos  */
jest.mock("firebase", () => ({
    firestore() {
        return {
            collection: () => ({
                where: jest.fn(() => (
                    {
                        get: jest.fn(() => (
                            {
                                docs: [
                                    {
                                        ref: {
                                            update: () => { },
                                            delete: () => { },
                                        }
                                    },
                                ]
                            }
                        ))
                    }
                )),
                add: jest.fn(() => ({})),
                doc: jest.fn(() => ({ set: () => { }, delete: () => { } })),
            })
        }
    }
}))

/**
 * Deshabilitaando  console.log en las pruebas
 */
console.log = () => { }
