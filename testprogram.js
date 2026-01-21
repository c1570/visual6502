// This file testprogram.js can be substituted by one of several tests
// which may not be redistributable
// for example
//    cbmbasic  loaded at 0xa000 with entry point 0xe394
//    test6502 (by Bird Computer) loaded at 0x8000 with entry point 0x8000
//
// (can use xxd -i to convert binary into C include syntax, as a starting point)
//
testprogramAddress=0x0000;

// we want to auto-clear the console if any output is sent by the program
var consoleboxStream="";

// demonstrate write hook
writeTriggers[0x000F]="consoleboxStream += String.fromCharCode(d);"+
                      "consolebox.innerHTML = consoleboxStream;";

// demonstrate read hook (not used by this test program)
readTriggers[0xD011]="((consolegetc==undefined)?0:0xff)";  // return zero until we have a char
readTriggers[0xD010]="var c=consolegetc; consolegetc=undefined; (c)";

// Create a 64KB test program
testprogram = new Array(65536);

// Fill with zeros (NOP/BRK padding)
for(var i = 0; i < 65536; i++) {
	testprogram[i] = 0x00;
}

// Set up the program at address 0x0000
testprogram[0x0000] = 0x58;        // CLI - Clear interrupt disable flag
testprogram[0x0001] = 0xB8;        // CLV clear overflow
testprogram[0x0002] = 0x18;        // CLC clear carry
testprogram[0x0003] = 0x69;        // ADC add (with carry)...
testprogram[0x0004] = 0x01;        // ...#$01
testprogram[0x0005] = 0x4C;        // JMP...
testprogram[0x0006] = 0x01;        // ...to 0x0001
testprogram[0x0007] = 0x00;        // High byte of jump address
testprogram[0x0010] = 0x40;        // RTI - Return from interrupt (IRQ handler)
testprogram[0x0020] = 0x40;        // RTI - Return from interrupt (NMI handler)

// Set up IRQ vector at 0xFFFE/0xFFFF
testprogram[0xFFFE] = 0x10;        // IRQ vector low byte
testprogram[0xFFFF] = 0x00;        // IRQ vector high byte

// Set up NMI vector at 0xFFFA/0xFFFB
testprogram[0xFFFA] = 0x20;        // NMI vector low byte
testprogram[0xFFFB] = 0x00;        // NMI vector high byte

// Reset vector at 0xFFFC/0xFFFD points to $0000 already
