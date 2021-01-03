const createMemory = require('./memory')
const CPU = require('./cpu')
const { Register, RegisterIndex } = require('./register')
const Instruction = require('./instruction')

const memoryInBytes = 256 * 256

// Create memory
const memory = createMemory(memoryInBytes)
// Create a writable Uint8Array, where bytes can be written to,
// from the array buffer of the original memory DataView
const writableArrayBuffer = new Uint8Array(memory.buffer)

// Intialise new CPU with memory
const cpu = new CPU(memory)

// Incrementing pointer to make inserting values into memory easier
let i = 0

// Move literal value into general 1 register
writableArrayBuffer[i++] = Instruction.MOVE_LITERAL_REGISTER
writableArrayBuffer[i++] = 0x12 // 0x1234
writableArrayBuffer[i++] = 0x34
writableArrayBuffer[i++] = RegisterIndex.GENERAL_1

// Move literal value into general 2 register
writableArrayBuffer[i++] = Instruction.MOVE_LITERAL_REGISTER
writableArrayBuffer[i++] = 0xab // 0xABCD
writableArrayBuffer[i++] = 0xcd
writableArrayBuffer[i++] = RegisterIndex.GENERAL_2

// Add two registers together
writableArrayBuffer[i++] = Instruction.ADD_REGISTER_REGISTER
writableArrayBuffer[i++] = RegisterIndex.GENERAL_1
writableArrayBuffer[i++] = RegisterIndex.GENERAL_2

// Store value back into main memory
writableArrayBuffer[i++] = Instruction.MOVE_REGISTER_MEMORY
writableArrayBuffer[i++] = RegisterIndex.RESULTS
writableArrayBuffer[i++] = 0x01
writableArrayBuffer[i++] = 0x00 // 0x0100 (Address beyond where the program ends)

// Run the CPU steps
cpu.debug()
cpu.viewMemoryAtAddress(cpu.getRegister(Register.INSTRUCTION_POINTER))
cpu.viewMemoryAtAddress(0x0100)

cpu.step()
cpu.debug()
cpu.viewMemoryAtAddress(cpu.getRegister(Register.INSTRUCTION_POINTER))
cpu.viewMemoryAtAddress(0x0100)

cpu.step()
cpu.debug()
cpu.viewMemoryAtAddress(cpu.getRegister(Register.INSTRUCTION_POINTER))
cpu.viewMemoryAtAddress(0x0100)

cpu.step()
cpu.debug()
cpu.viewMemoryAtAddress(cpu.getRegister(Register.INSTRUCTION_POINTER))
cpu.viewMemoryAtAddress(0x0100)

cpu.step()
cpu.debug()
cpu.viewMemoryAtAddress(cpu.getRegister(Register.INSTRUCTION_POINTER))
cpu.viewMemoryAtAddress(0x0100)
