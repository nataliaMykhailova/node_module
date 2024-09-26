import { ActionTokenTypeEnum } from "../enums/action-token-type.enum";
import { EmailType } from "../enums/email-type.enum";
import { ApiError } from "../errors/api-error";
import {
  IForgotResetPassword,
  IForgotSendEmail,
} from "../interfaces/action-token.interface";
import { ITokenPair, ITokenPayload } from "../interfaces/token.interface";
import { ILogin, IUser } from "../interfaces/user.interface";
import { actionTokenRepository } from "../repositories/action-token-repository";
import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";
import { emailService } from "./email.service";
import { passwordService } from "./password.service";
import { tokenService } from "./token.service";

class AuthService {
  public async signUp(
    dto: IUser,
  ): Promise<{ user: IUser; tokens: ITokenPair }> {
    await this.isEmailExist(dto.email);

    const password = await passwordService.hashPassword(dto.password);
    const user = await userRepository.create({ ...dto, password });

    const tokens = await tokenService.generatePair({
      userId: user._id,
      role: user.role,
    });
    const actionToken = await tokenService.generateActionToken(
      {
        userId: user._id,
        role: user.role,
      },
      ActionTokenTypeEnum.VERIFY_EMAIL,
    );
    await tokenRepository.create({ ...tokens, _userId: user._id });
    await actionTokenRepository.create({
      actionToken,
      type: ActionTokenTypeEnum.VERIFY_EMAIL,
      _userId: user._id,
    });
    await emailService.sendEmail(EmailType.WELCOME, dto.email, {
      name: dto.username,
      actionToken,
    });
    return { user, tokens };
  }

  public async signIn(
    dto: ILogin,
  ): Promise<{ user: IUser; tokens: ITokenPair }> {
    const user = await userRepository.getByParams({ email: dto.email });
    if (!user) {
      throw new ApiError("Invalid credentials", 401);
    }

    const isPasswordCorrect = await passwordService.comparePassword(
      dto.password,
      user.password,
    );
    if (!isPasswordCorrect) {
      throw new ApiError("Invalid credentials", 401);
    }

    const tokens = await tokenService.generatePair({
      userId: user._id,
      role: user.role,
    });
    await tokenRepository.create({ ...tokens, _userId: user._id });
    return { user, tokens };
  }

  private async isEmailExist(email: string): Promise<void> {
    const user = await userRepository.getByParams({ email });
    if (user) {
      throw new ApiError("Email already exists", 409);
    }
  }
  public async refreshToken(
    payload: ITokenPayload,
    oldTokenId: string,
  ): Promise<ITokenPair> {
    const tokens = await tokenService.generatePair({
      userId: payload.userId,
      role: payload.role,
    });
    await tokenRepository.create({ ...tokens, _userId: payload.userId });
    await tokenRepository.deleteById(oldTokenId);
    return tokens;
  }

  public async logoutAll(payload: ITokenPayload): Promise<void> {
    await tokenRepository.deleteByParams({ _userId: payload.userId });
    const user = await userRepository.getOneUser(payload.userId);
    await emailService.sendEmail(EmailType.LOGOUT, user.email, {
      name: user.username,
    });
  }

  public async logout(payload: ITokenPayload, tokenId: string): Promise<void> {
    await tokenRepository.deleteById(tokenId);
    const user = await userRepository.getOneUser(payload.userId);
    await emailService.sendEmail(EmailType.LOGOUT, user.email, {
      name: user.username,
    });
  }
  public async forgotPassword(dto: IForgotSendEmail): Promise<void> {
    const user = await userRepository.getByParams({ email: dto.email });
    if (!user) return;
    const actionToken = await tokenService.generateActionToken(
      { userId: user._id, role: user.role },
      ActionTokenTypeEnum.FORGOT_PASSWORD,
    );
    await actionTokenRepository.create({
      actionToken,
      type: ActionTokenTypeEnum.FORGOT_PASSWORD,
      _userId: user._id,
    });
    await emailService.sendEmail(EmailType.FORGOT_PASSWORD, dto.email, {
      name: user.username,
      actionToken,
    });
  }

  public async forgotPasswordSet(
    dto: IForgotResetPassword,
    jwtPayload: ITokenPayload,
  ): Promise<void> {
    const password = await passwordService.hashPassword(dto.password);
    await userRepository.update(jwtPayload.userId, { password });

    await actionTokenRepository.deleteByParams({
      _userId: jwtPayload.userId,
      type: ActionTokenTypeEnum.FORGOT_PASSWORD,
    });
    await tokenRepository.deleteByParams({
      _userId: jwtPayload.userId,
    });
  }
  public async verifyEmail(jwtPayload: ITokenPayload): Promise<void> {
    await userRepository.update(jwtPayload.userId, { isVerified: true });
    await actionTokenRepository.deleteByParams({
      _userId: jwtPayload.userId,
      type: ActionTokenTypeEnum.VERIFY_EMAIL,
    });
  }
}

export const authService = new AuthService();
