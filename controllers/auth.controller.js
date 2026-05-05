import db from "../models/index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import authConfig from "../config/auth.config.js";

const { user: User, role: Role, refreshToken: RefreshToken } = db;

export const signup = async (req, res) => {
    try {
        const { username, email, password, roles } = req.body;
        const hashedPassword = await bcrypt.hash(password, 8);
        const user = await User.create({
            username, 
            email,
            password: hashedPassword,
        });

        if (roles) {
            const rolesFound = await Role.findAll({
                where: {
                    name: roles,
                },
            });
            await user.setRoles(rolesFound);
        } else {
            const userRole = await Role.findOne({ where: { name: "user" } });
            await user.setRoles([userRole]);
        }

        res.status(201).json({ message: "User registrado" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const refreshToken = async (req, res) => {
    const { refreshToken: requestToken } = req.body;

    if (requestToken == null) {
        return res.status(403).json({ message: "Refresh Token es requerido!" });
    }

    try {
        let refreshToken = await RefreshToken.findOne({ where: { token: requestToken } });

        if (!refreshToken) {
            res.status(403).json({ message: "Refresh token no está en la base de datos!" });
            return;
        }

        if (RefreshToken.verifyExpiration(refreshToken)) {
            RefreshToken.destroy({ where: { id: refreshToken.id } });
            res.status(403).json({
                message: "Refresh token ha expirado. Por favor inicie sesión nuevamente",
            });
            return;
        }

        const user = await refreshToken.getUser();
        let newAccessToken = jwt.sign({ id: user.id }, authConfig.secret, {
            expiresIn: authConfig.jwtExpiration,
        });

        return res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: refreshToken.token,
        });
    } catch (err) {
        return res.status(500).send({ message: err });
    }
};

export const signout = async (req, res) => {
    try {
        const { refreshToken: requestToken } = req.body;
        if (requestToken) {
            await RefreshToken.destroy({ where: { token: requestToken } });
        }
        res.status(200).json({ message: "Sesión cerrada correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const signin = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ 
            where: { username },
            include: { model: Role, as: "roles" },
        });

        if (!user) {
            return res.status(404).json({ message: "User no encontrado" });
        }

        const passwordIsValid = await bcrypt.compare(password, user.password);

        if (!passwordIsValid) {
            return res.status(401).json({
                accessToken: null,
                message: "Invalid password",
            });
        }

        const token = jwt.sign({ id: user.id }, authConfig.secret, {
            expiresIn: authConfig.jwtExpiration,
        });

        let refreshToken = await RefreshToken.createToken(user);

        const authorities = user.roles.map((role) => `ROLE_${role.name.toUpperCase()}`);

        res.status(200).json({
            id: user.id,
            username: user.username,
            email: user.email,
            roles: authorities,
            accessToken: token,
            refreshToken: refreshToken,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};