"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateConversationSessionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_conversation_session_dto_1 = require("./create-conversation-session.dto");
class UpdateConversationSessionDto extends (0, swagger_1.PartialType)(create_conversation_session_dto_1.CreateConversationSessionDto) {
}
exports.UpdateConversationSessionDto = UpdateConversationSessionDto;
//# sourceMappingURL=update-conversation-session.dto.js.map