import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

class AuthUtils {
   public static hash = async (password: string): Promise<string> => {
      return await bcrypt.hash(password, 10);
   };

   public static passwordCompare = async (
      passCredentials: string,
      passResource: string,
   ): Promise<boolean> => {
      return await bcrypt.compare(passCredentials, passResource);
   };

   public static generateToken = (id: number, role: string): string => {
      let options = {
         maxAge: 20 * 60 * 1000, // would expire in 20minutes
         httpOnly: true, // The cookie is only accessible by the web server
         secure: true,
         sameSite: 'None',
      };
      const accessToken: string = jwt.sign(
         {
            userId: id,
            role: role,
            isValid: true,
         },
         process.env.ACCESS_TOKEN_SECRET_KEY || '',
         {
            expiresIn: '7d',
         },
      );

      return accessToken;
   };
}

export default AuthUtils;
